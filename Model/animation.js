import mongoose from "mongoose";
const Animation = mongoose.Schema(
  {
    nameAnimation: String,
  },
  { timestamps: true }
);

const animationModel = mongoose.model("animations", Animation);
export default animationModel;
