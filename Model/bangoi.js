import mongoose from "mongoose";

const bangoi = mongoose.Schema(
  {
    idFilm: String,
    idRoom: String,
    timeStart: String,
  },
  { timestamps: true }
);

const bangoiModel = mongoose.model("bangois", bangoi);
export default bangoiModel;
