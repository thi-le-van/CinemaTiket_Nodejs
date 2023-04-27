import mongoose from "mongoose";

const Area = mongoose.Schema(
  {
    nameArea: String,
  },
  { timestamps: true }
);

const areaModel = mongoose.model("areas", Area);
export default areaModel;
