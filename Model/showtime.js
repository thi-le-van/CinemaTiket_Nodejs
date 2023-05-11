import mongoose from "mongoose";
const Showtime = mongoose.Schema(
  {
    price: String,
    timeStart: String,
    date: Date,
    idArea: String,
    idTheater: String,
    idFilm: String,
    idRoom: String,
    idAnimation: String,
  },
  { timestamps: true }
);

const showtimeModel = mongoose.model("showtimes", Showtime);
export default showtimeModel;
