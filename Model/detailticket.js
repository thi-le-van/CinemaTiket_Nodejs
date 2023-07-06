import mongoose from "mongoose";

const DetailTicket = mongoose.Schema(
  {
    idTicket: String,
    idShowTime: String,
    email: String,
    date: Date,
    detail: {
      chair: String,
      price: String,
    },
    checkout: { default: false, type: Boolean },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 180,
    },
  },
  { timestamps: true }
);
const detailTicketModel = mongoose.model("detailTickets", DetailTicket);
export default detailTicketModel;
