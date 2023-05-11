import mongoose from "mongoose";
const Movie = mongoose.Schema(
  {
    nameFilm: String,
    picture: String,
    date: Date,
    time: String,
    directors: String,
    genres: Array,
    animation: Array,
    content: String,
    actors: String,
    trailer: String,
  },
  { timestamps: true }
);

const movieModel = mongoose.model("movies", Movie);
export default movieModel;
