import { Router } from 'express';
import movieModel from '../Model/movie.js';
import personModel from '../Model/person.js';

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
  let { genres, duration, country, sort, ...query } = { ...req.query };

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
      sort = {};
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

  const data = await movieModel
    .find(query, {
      thumbnail: 1,
      _id: 1,
      name: 1,
      subName: 1,
      IMDB: 1,
      year: 1,
      country: 1,
      description: 1,
      genres: 1,
    })
    .sort(sort);
  res.send(data);
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

//find movie by ID
movieRoute.get('/:slug', (req, res) => {
  let data = {};
  movieModel
    .findOne({ _id: req.params.slug })
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
    .then((foundation) => {
      data._doc.foundation = foundation;
      res.send(data._doc);
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

export default movieRoute;
