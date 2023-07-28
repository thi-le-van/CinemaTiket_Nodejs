import mongoose from "mongoose";

const Chair = mongoose.Schema(
  {
    numberChair: Array,
    idRoom: String,
    idTicket: String,
    checkout: { default: false, type: Boolean },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 180,
    },
  },
  { timestamps: true }
);

const chairModel = mongoose.model("chairs", Chair);
export default chairModel;
