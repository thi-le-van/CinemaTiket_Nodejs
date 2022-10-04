import { Router } from 'express';
import authorizationMiddleWare from '../Middleware/authorization.js';

import dotenv from 'dotenv';
dotenv.config();

const userRoute = Router();
import UserModel from '../Model/user.js';

userRoute.get('/profile', authorizationMiddleWare, async (req, res) => {
  const userDoc = await UserModel.findOne(
    {
      _id: res.user._id,
      userName: res.user.userName,
    },
    { name: 1, userName: 1, createdAt: 1 }
  );
  res.send(userDoc);
});

export default userRoute;
