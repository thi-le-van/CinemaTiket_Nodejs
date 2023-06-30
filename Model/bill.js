import mongoose from "mongoose";

const Bill = mongoose.Schema(
  {
    idTicket: String,
    date: Date,
    email: String,
  },
  { timestamps: true }
);

const billModel = mongoose.model("bills", Bill);
export default billModel;
