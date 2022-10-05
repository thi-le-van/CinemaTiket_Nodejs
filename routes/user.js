import { Router } from 'express';
import authorizationMiddleWare from '../Middleware/authorization.js';

import dotenv from 'dotenv';
dotenv.config();

const userRoute = Router();
import UserModel from '../Model/user.js';

userRoute.post('/collection', authorizationMiddleWare, async (req, res) => {
  const user = req.body;
  const isExist = await UserModel.findOne(
    {
      _id: user._id,
      collections: user.movieId,
    },
    { _id: 1 }
  );
  if (isExist) {
    return res.send({
      type: 'warning',
      message: 'Phim đã tồn tại trong bộ sưu tập.',
    });
  }
  const data = await UserModel.updateOne(
    {
      _id: user._id,
    },
    { $addToSet: { collections: user.movieId } }
  );
  data &&
    res.send({ type: 'success', message: 'Thêm vào bộ sưu tập thành công.' });
});

export default userRoute;
