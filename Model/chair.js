import mongoose from "mongoose";

const Chair = mongoose.Schema(
  {
    rows: String,
    columns: String,
    idRoom: String,
  },
  { timestamps: true }
);

const chairModel = mongoose.model("chairs", Chair);
export default chairModel;
