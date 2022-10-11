import { Router } from 'express';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();
import authorizationMiddleWare from '../Middleware/authorization.js';
import UserModel from '../Model/user.js';
import MovieModel from '../Model/movie.js';

const userRoute = Router();

//============GET==============//

userRoute.get('/collection', authorizationMiddleWare, async (req, res) => {
  const _id = req.query.userId;
  const limit = +req.query.limit || 15;
  const currentPage = +req.query.currentPage || 1;
  const skip = (currentPage - 1) * limit;
  try {
    const moviesId = await UserModel.findOne(
      { _id: _id },
      {
        collections: 1,
        _id: 0,
      }
    );
    const collectionsId = moviesId.collections;
    const collections = MovieModel.find(
      { _id: { $in: collectionsId } },
      {
        _id: 1,
        name: 1,
        subName: 1,
        thumbnail: 1,
      }
    )
      .limit(limit)
      .skip(skip);
    const page = MovieModel.find(
      { _id: { $in: collectionsId } },
      {
        _id: 1,
        name: 1,
        subName: 1,
        thumbnail: 1,
      }
    ).count();
    Promise.all([collections, page]).then(([collections, page]) => {
      res.send({ collections, page: Math.ceil(page / limit) });
    });
  } catch (error) {
    res
      .status(500)
      .json('Internal server error.', 'Some thing wrong when find collections');
  }
});

//============POST==============//

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

//============PATCH==============//

userRoute.patch(
  '/change-password',
  authorizationMiddleWare,
  async (req, res) => {
    const { password, newPassword } = req.body;
    const hash = await UserModel.findOne(
      { userName: res.user.userName },
      { password: 1, _id: 0 }
    );
    bcrypt.compare(password, hash?.password, (err, result) => {
      if (!result) {
        return res
          .status(402)
          .json({ type: 'error', message: 'Wrong password' });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newPassword, salt, function (err, hash) {
            UserModel.updateOne(
              { userName: res.user.userName },
              { password: hash }
            ).then((data) => {
              if (data?.modifiedCount) {
                res.status(200).json({
                  type: 'success',
                  message: 'Change password successfully.',
                });
              }
            });
          });
        });
      }
    });
  }
);

//============DE:ETE==============//
userRoute.delete('/collection', authorizationMiddleWare, (req, res) => {
  const movieId = req.query.movieId;
  const userId = res.user._id;
  UserModel.updateOne(
    { _id: userId },
    {
      $pull: { collections: movieId },
    }
  )
    .then((result) => {
      if (result.modifiedCount) {
        res.send({
          type: 'warning',
          message: 'Xóa phim khỏi bộ sưu tập thành công.',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ type: 'error', message: 'something wrong' });
    });
});

export default userRoute;
