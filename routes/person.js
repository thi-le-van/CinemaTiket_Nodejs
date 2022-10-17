import { Router } from 'express';
import mongoose from 'mongoose';
import PersonModel from '../Model/person.js';
import MovieModel from '../Model/movie.js';

const personRoute = Router();
const ObjectId = mongoose.Types.ObjectId;

personRoute.post('/', (req, res) => {
  const person = req.body;
  if (person) {
    PersonModel.create(person, (err, result) => {
      if (err) res.status(500).send('Internal server error!');
      else {
        console.log('Saved person to DB!');
        res.status(200).send('Upload person successfully!');
      }
    });
  }
});

personRoute.get('/:slug', async (req, res) => {
  const data = await PersonModel.findOne({
    _id: req.params.slug,
  });
  const newMovieParticipated = data.movieParticipated.filter((movieId) => {
    if (ObjectId.isValid(movieId)) {
      return true;
    }
    return false;
  });
  try {
    const moviesParticipated = await MovieModel.find(
      {
        _id: { $in: newMovieParticipated },
      },
      { _id: 1, name: 1, subName: 1, thumbnail: 1 }
    );
    data.movieParticipated = moviesParticipated;
  } catch (error) {}
  res.send(data);
});

export default personRoute;
