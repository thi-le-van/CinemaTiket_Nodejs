import mongoose from "mongoose";

const Movie = mongoose.Schema(
  {
    nameFilm: String,
    picture: String,
    date: Date,
    time: Number,
    directors: String,
    genres: String,
    content: String,
    actors: String,
  },
  { timestamps: true }
);

const movieModel = mongoose.model("movies", Movie);
export default movieModel;
