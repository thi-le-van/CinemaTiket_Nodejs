import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import UserModel from '../Model/user.js';
import TokenModel from '../Model/token.js';
import authorizationMiddleWare from '../Middleware/authorization.js';

const authRoute = Router();
const saltRounds = 10;

authRoute.post('/signUp', async (req, res) => {
  const { password, ...user } = req.body;

  const isExists = await UserModel.findOne(
    { userName: user?.userName },
    { _id: 0, userName: 1 }
  );

  if (!isExists) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      UserModel.create({ ...user, password: hash }, (err) => {
        if (err) res.sendStatus(500);
        console.log('Created new user!');
        res.send({ type: 'success' });
      });
    });
  } else {
    res.send({ type: 'exist' });
  }
});

authRoute.get('/signIn', async (req, res) => {
  const user = req.query;
  const hash = await UserModel.findOne(
    { userName: user.userName },
    { password: 1, _id: 0 }
  );
  bcrypt.compare(user.password, hash.password, async function (err, result) {
    if (result) {
      let data = await UserModel.findOne(
        {
          userName: user.userName,
        },
        { userName: 1, name: 1, createdAt: 1 }
      );
      const userData = data._doc;
      userData._id = userData._id.toString();
      userData.createdAt = userData.createdAt.toString();
      const accessToken = jwt.sign(userData, process.env.TOKEN_ACCESS_KEY, {
        expiresIn: '10s',
      });

      const refreshToken = jwt.sign(userData, process.env.TOKEN_REFRESH_KEY);

      await TokenModel.create({ token: refreshToken }, (err) => {
        if (err) console.log('Save token field');
        else {
          console.log('save token to DB!');
        }
      });

      return res
        .cookie('token', refreshToken, {
          httpOnly: true,
          path: '/',
        })
        .status(200)
        .json({
          type: 'success',
          user: { ...userData, accessToken },
        });
    } else {
      res.send({ type: 'wrong' });
    }
  });
});

authRoute.get('/logout', authorizationMiddleWare, async (req, res) => {
  const refreshToken = req.cookies.token;

  const result = await TokenModel.deleteOne({ token: refreshToken });

  if (result.acknowledged) {
    res.sendStatus(200);
  } else {
    res.status(401).json('Error when delete token');
  }
});

authRoute.get('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.token;
  try {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_REFRESH_KEY,
      async (err, data) => {
        data = { ...data, iat: Math.floor(Date.now() / 1000) };
        if (err) res.status(403).json('RefreshToken is not valid!');
        await TokenModel.deleteOne({ token: refreshToken });
        const newAccessToken = jwt.sign(data, process.env.TOKEN_ACCESS_KEY, {
          expiresIn: '30s',
        });
        const newRefreshToken = jwt.sign(data, process.env.TOKEN_REFRESH_KEY);
        await TokenModel.create({ token: newRefreshToken }, (err) => {
          if (err) console.log('Save token failed');
          else {
            console.log('save token to DB!');
            res
              .cookie('token', refreshToken, {
                httpOnly: true,
                path: '/',
              })
              .send({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });
          }
        });
      }
    );
  } catch (error) {}
});

export default authRoute;
