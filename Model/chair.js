import mongoose from "mongoose";

const Chair = mongoose.Schema(
  {
    status:{type:Boolean,default:false},
    numberChairs: Array
  },
  { timestamps: true }
);

const chairModel = mongoose.model("chairs", Chair);
export default chairModel;
