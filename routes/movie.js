import { Router } from 'express';
import movieModel from '../Model/movie.js';
import personModel from '../Model/person.js';
import commentsModel from '../Model/comments.js';
import userModel from '../Model/user.js';
import authorizationMiddleWare from '../Middleware/authorization.js';

const movieRoute = Router();

///////////////////GET METHOD//////////////

// Nominated At home page
movieRoute.get('/nominated', async (req, res) => {
  const data = await movieModel
    .find({}, { _id: 1, name: 1, subName: 1, thumbnail: 1 })
    .sort({ updatedAt: -1 })
    .limit(5);
  res.send(data);
});

// newest updated type=show in home page
movieRoute.get('/home/:slug', async (req, res) => {
  const data = await movieModel
    .find(
      { type: req.params.slug },
      { _id: 1, name: 1, thumbnail: 1, subName: 1 }
    )
    .sort({ updatedAt: -1 })
    .limit(10);
  res.send(data);
});

//filter
movieRoute.get('/filter', async (req, res) => {
  const limit = 4;
  let {
    genres,
    duration,
    country,
    sort,
    currentPage = 1,
    ...query
  } = {
    ...req.query,
  };
  switch (sort) {
    case 'updated':
      sort = { updatedAt: -1 };
      break;
    case 'publishDate':
      sort = { createdAt: -1 };
      break;
    case 'rating':
      sort = { IMDB: -1 };
      break;
    default:
      sort = { updatedAt: -1 };
      break;
  }

  if (genres) {
    query['genres.value'] = { $in: [genres] };
  }
  if (country) {
    query['country.value'] = { $in: [country] };
  }
  if (duration) {
    let [start, end] = duration.split('-');
    if (end === 0) {
      end = 99999;
    }
    query.$and = [{ duration: { $gte: start } }, { duration: { $lte: end } }];
  }

  const skip = limit * (Number(currentPage) - 1);

  try {
    const data = movieModel
      .find(query, { _id: 1, thumbnail: 1, name: 1, subName: 1 })
      .skip(skip)
      .limit(limit)
      .sort(sort);
    const pageCount = movieModel.find(query).count();
    Promise.all([data, pageCount]).then(([data, count]) => {
      res.send({
        data,
        pageCount: Math.ceil(count / limit),
      });
    });
  } catch (error) {
    res.send(error);
  }
});

//most views page
movieRoute.get('/top', (req, res) => {
  const limit = req.query.limit || 30;
  let day, week, month;
  day = movieModel.find({}).sort({ 'views.day': -1 }).limit(limit);
  week = movieModel.find({}).sort({ 'views.week': -1 }).limit(limit);
  month = movieModel.find({}).sort({ 'views.month': -1 }).limit(limit);
  Promise.all([day, week, month]).then((data) => {
    res.send(data);
  });
});

//search page
movieRoute.get('/search', async (req, res) => {
  const name = req.query.name,
    limit = req.query.limit || 30;
  const data = await movieModel
    .find(
      {
        $or: [
          {
            name: { $regex: `.*${name}.*`, $options: 'i' },
          },
          {
            subName: { $regex: `.*${name}.*`, $options: 'i' },
          },
        ],
      },
      { thumbnail: 1, _id: 1, name: 1, subName: 1 }
    )
    .limit(limit);
  res.send(data);
});

//find movie by ID at Watch page
movieRoute.get('/watch', async (req, res) => {
  const _id = req.query.movieId || '';
  const data = await movieModel.findOne(
    { _id: _id },
    { episodes: 1, name: 1, subName: 1, season: 1, year: 1 }
  );
  res.send(data);
});

//comments of movie(id)
movieRoute.get('/comments', authorizationMiddleWare, async (req, res) => {
  const movieId = req.query.movieId;
  const limit = +req.query.limit || 5;
  const skip = +req.query.skip || 0;
  try {
    const data = await commentsModel.aggregate([
      {
        $facet: {
          data: [
            {
              $match: { movieId: movieId },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                userId: 1,
                movieId,
                createdAt: 1,
                message: 1,
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]);
    const totalCount = await commentsModel
      .find({
        movieId: movieId,
      })
      .count();
    res.send({ ...data[0], totalCount });
  } catch (error) {
    console.log(error);
  }
});

//find movie by ID
movieRoute.get('/:slug', (req, res) => {
  const movieId = req.params.slug;
  const userId = req.query?.userId;
  let data = {};
  movieModel
    .findOne({ _id: movieId })
    .then((movie) => {
      data = { ...movie };
      return personModel.find(
        { _id: { $in: movie.actors } },
        { name: 1, thumbnail: 1 }
      );
    })
    .then((actors) => {
      data._doc.actors = actors;
      return personModel.find(
        { _id: { $in: data._doc.foundation } },
        { name: 1 }
      );
    })
    .then(async (foundation) => {
      data._doc.foundation = foundation;
      const match = await userModel
        .findOne({
          _id: userId,
          collections: movieId,
        })
        .count();
      res.send({ ...data._doc, isCollected: !!match });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

///////////////////POST METHOD//////////////

movieRoute.post('/', (req, res) => {
  const movie = req.body;
  movieModel.create(movie, (err) => {
    if (err) res.status(500).json('Internal server error!');
    else {
      console.log('Saved to DB!');
      res.send('Upload movie successfully!');
    }
  });
});

movieRoute.post('/comment', authorizationMiddleWare, (req, res) => {
  const comment = req.body;
  commentsModel.create(comment, (err, comment) => {
    if (err) res.status(500).json('Server error when saving comment to DB.');
    else
      res.send({
        type: 'success',
        message: 'Add comment successfully.',
        comment,
      });
  });
});

///////////////////DELETE METHOD//////////////
movieRoute.delete('/comment', authorizationMiddleWare, (req, res) => {
  const _id = req.query._id;
  const userId = res.user._id;
  commentsModel
    .deleteOne({
      _id: _id,
      userId: userId,
    })
    .then((data) => {
      if (data.deletedCount) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });
});

export default movieRoute;
