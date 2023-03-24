import mongoose from "mongoose";

const Theater = mongoose.Schema(
  {
    nameTheater: String,
    location: String,
  },
  { timestamps: true }
);

const theaterModel = mongoose.model("theaters", Theater);
export default theaterModel;
