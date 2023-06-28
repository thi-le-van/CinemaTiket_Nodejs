import mongoose from "mongoose";

const Chair = mongoose.Schema(
  {
    numberChair: Array,
    idRoom:String
  },
  { timestamps: true }
);

const chairModel = mongoose.model("chairs", Chair);
export default chairModel;
