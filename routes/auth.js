import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import UserModel from "../Model/user.js";
import TokenModel from "../Model/token.js";
import authorizationMiddleWare from "../Middleware/authorization.js";

const authRoute = Router();
const saltRounds = 10;

authRoute.post("/register", async (req, res) => {
  const { ...user } = req.body;

  const isExists = await UserModel.findOne(
    { email: user?.email },
    { _id: 0, email: 1 }
  );

  if (!isExists) {
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      UserModel.create({ ...user, password: hash }, (err) => {
        if (err) res.sendStatus(500);
        console.log("Created new user!");
        return res.send({ type: "success" });
      });
    });
  } else {
    return res.status(400).send("user exist");
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    const { ...user } = req.body;
    const userMatch = await UserModel.findOne({ email: user.email });
    bcrypt.compare(
      user.password,
      userMatch?.password || "",
      async function (err, result) {
        if (result) {
          const accessToken = jwt.sign(
            { email: userMatch.email, _id: userMatch._id },
            process.env.TOKEN_ACCESS_KEY,
            {
              expiresIn: "24h",
            }
          );

          const refreshToken = jwt.sign(
            { email: userMatch.email, _id: userMatch._id },
            process.env.TOKEN_REFRESH_KEY
          );
          await TokenModel.create({ token: refreshToken }, (err) => {
            if (err) console.log("Save token field");
            else {
              console.log("save token to DB!");
            }
          });
          const newData = { ...userMatch._doc };
          delete newData.password;
          delete newData.createdAt;
          delete newData.updatedAt;
          delete newData._id;
          return res.status(200).json({
            type: "success",
            user: { ...newData, accessToken },
            refreshToken,
          });
        } else {
          return res
            .status(400)
            .send({ type: "error", message: "Email or password incorrect." });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

authRoute.post("/logout", async (req, res) => {
  try {
    let { token } = req.cookies;
    token = token?.split(" ")[1];
    const result = await TokenModel.deleteOne({ token });

    if (result.acknowledged) {
      res.send("success");
    } else {
      res.status(500).json("Error when delete token");
    }
  } catch (error) {
    console.log(error);
  }
});

authRoute.get("/refresh-token", async (req, res) => {
  let refreshToken;
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken.split(" ")[1];
  }
  try {
    if (!refreshToken) {
      refreshToken = req.query.refreshToken.split(" ")[1];
    }
    jwt.verify(
      refreshToken,
      process.env.TOKEN_REFRESH_KEY,
      async (err, data) => {
        data = { ...data, iat: Math.floor(Date.now() / 1000) };
        if (err) return res.status(403).json("RefreshToken is not valid!");
        const deleted = await TokenModel.deleteOne({ token: refreshToken });
        if (deleted.deletedCount == 0) {
          return res
            .status(401)
            .json({ type: "expired", message: "Token expired" });
        }
        const newAccessToken = jwt.sign(data, process.env.TOKEN_ACCESS_KEY, {
          expiresIn: "30s",
        });
        const newRefreshToken = jwt.sign(data, process.env.TOKEN_REFRESH_KEY);
        await TokenModel.create({ token: newRefreshToken }, (err) => {
          if (err) {
            console.log("Save token failed");
            res.status(500).json("Fail when save token to db");
          } else {
            console.log("save token to DB!");
            res
              // .cookie('refreshToken', 'Bearer ' + newRefreshToken, {
              //   httpOnly: true,
              //   path: '/',
              // })
              .status(200)
              .json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

export default authRoute;
