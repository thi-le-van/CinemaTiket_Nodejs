import { Router } from 'express';
import PersonModel from '../Model/person.js';

const personRoute = Router();

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

personRoute.get('/:slug', (req, res) => {
  PersonModel.findOne(
    {
      _id: req.params.slug,
    },
    (err, result) => {
      if (err) res.status(500).json('Internal server error!');
      else {
        res.send(result);
      }
    }
  );
});

export default personRoute;
