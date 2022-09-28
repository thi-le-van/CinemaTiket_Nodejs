import { Router } from 'express';
import movieModel from '../Model/movie.js';
import personModel from '../Model/person.js';

const movieRoute = Router();

// Nominated At home page
movieRoute.get('/nominated', async (req, res) => {
  const data = await movieModel
    .find({}, { _id: 1, name: 1, subName: 1, thumbnail: 1 })
    .sort({ updatedAt: -1 })
    .limit(5);
  res.send(data);
});

// newest updated type=show in home page
movieRoute.get('/:slug/home', async (req, res) => {
  const data = await movieModel
    .find(
      { type: req.params.slug },
      { _id: 1, name: 1, thumbnail: 1, subName: 1 }
    )
    .sort({ updatedAt: -1 })
    .limit(10);
  res.send(data);
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
