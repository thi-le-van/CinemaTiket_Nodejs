import mongoose from 'mongoose';

const personSchema = mongoose.Schema({
  name: String,
  story: String,
  thumbnail: String,
  job: String,
  gender: String,
  dateOfBirth: String,
  placeOfBirth: String,
  movieParticipated: Array,
  photos: Array,
});

const personModel = mongoose.model('actors', personSchema);
export default personModel;
