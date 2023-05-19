import mongoose from "mongoose";
const Showtime = mongoose.Schema(
  {
    price: String,
    timeStart: String,
    date: Date,
    idFilm: String,
    idRoom: String,
  },
  { timestamps: true }
);

const showtimeModel = mongoose.model("showtimes", Showtime);
export default showtimeModel;
