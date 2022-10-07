import { Router } from 'express';
import authorizationMiddleWare from '../Middleware/authorization.js';

import dotenv from 'dotenv';
dotenv.config();

const userRoute = Router();
import UserModel from '../Model/user.js';
import MovieModel from '../Model/movie.js';

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

export default userRoute;
