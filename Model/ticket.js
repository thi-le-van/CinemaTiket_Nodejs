import mongoose from "mongoose";

const Ticket = mongoose.Schema(
  {
    price: String,
    idShowTime: String,
    chairs: Array,
    email:String,
    checkout:{default:false,type:Boolean},
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 180
  },
  },
  { timestamps: true },
);
const ticketModel = mongoose.model("tickets", Ticket);
export default ticketModel;
