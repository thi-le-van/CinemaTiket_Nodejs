import mongoose from "mongoose";

const Room = mongoose.Schema(
  {
    nameRoom: String,
    rows: String,
    columns: String,
    idTheater: String,
  },
  { timestamps: true }
);

const roomModel = mongoose.model("rooms", Room);
export default roomModel;
