import mongoose from "mongoose";

const Bill = mongoose.Schema(
  {
    idTicket: String,
    email: String,
  },
  { timestamps: true }
);

const billModel = mongoose.model("bills", Bill);
export default billModel;
