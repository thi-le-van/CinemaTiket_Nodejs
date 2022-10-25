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
        expiresIn: '2s',
      });

      const refreshToken = jwt.sign(userData, process.env.TOKEN_REFRESH_KEY);

      await TokenModel.create({ token: refreshToken }, (err) => {
        if (err) console.log('Save token field');
        else {
          console.log('save token to DB!');
        }
      });
      console.log(refreshToken);
      res
        // .cookie('refreshToken', 'Bearer ' + refreshToken, {
        //   httpOnly: true,
        //   path: '/',
        // })
        .status(200)
        .json({
          type: 'success',
          user: { ...userData, accessToken },
          refreshToken,
        });
    } else {
      res.status(402).json({ type: 'error', message: 'Wrong password.' });
    }
  });
});

authRoute.get('/logout', async (req, res) => {
  let refreshToken;
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken.split(' ')[1];
  }
  try {
    if (!refreshToken) {
      refreshToken = req.query.refreshToken;
    }

    const result = await TokenModel.deleteOne({ token: refreshToken });

    if (result.acknowledged) {
      res.sendStatus(200);
    } else {
      res.status(401).json('Error when delete token');
    }
  } catch (error) {
    console.log(error);
  }
});

authRoute.get('/refresh-token', async (req, res) => {
  let refreshToken;
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken.split(' ')[1];
  }
  try {
    if (!refreshToken) {
      refreshToken = req.query.refreshToken;
    }
    jwt.verify(
      refreshToken,
      process.env.TOKEN_REFRESH_KEY,
      async (err, data) => {
        data = { ...data, iat: Math.floor(Date.now() / 1000) };
        if (err) return res.status(403).json('RefreshToken is not valid!');
        const deleted = await TokenModel.deleteOne({ token: refreshToken });
        if (deleted.deletedCount == 0) {
          return res
            .status(401)
            .json({ type: 'expired', message: 'Token expired' });
        }
        const newAccessToken = jwt.sign(data, process.env.TOKEN_ACCESS_KEY, {
          expiresIn: '2s',
        });
        const newRefreshToken = jwt.sign(data, process.env.TOKEN_REFRESH_KEY);
        await TokenModel.create({ token: newRefreshToken }, (err) => {
          if (err) {
            console.log('Save token failed');
            res.status(500).json('Fail when save token to db');
          } else {
            console.log('save token to DB!');
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
    console.log('something wrong');
  }
});

export default authRoute;
