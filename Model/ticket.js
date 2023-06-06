import mongoose from "mongoose";

const Ticket = mongoose.Schema(
  {
    price: String,
    idShowTime: String,
    chairs: Array,
    email:String,
    checkou:{default:false,type:Boolean},
  //   expireAt: {
  //     type: Date,
  //     default: Date.now
  // },
  },
  { timestamps: true },
);
Ticket.index({ expireAt: 1 }, { expireAfterSeconds:3600 });
const ticketModel = mongoose.model("tickets", Ticket);
export default ticketModel;
