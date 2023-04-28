import mongoose from "mongoose";

const Theater = mongoose.Schema(
  {
    idArea: String,
    nameTheater: String,
    address: String,
  },
  { timestamps: true }
);

const theaterModel = mongoose.model("theaters", Theater);
export default theaterModel;
