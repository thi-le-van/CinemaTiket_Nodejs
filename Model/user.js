import mongoose from 'mongoose';

const user = mongoose.Schema(
  {
    name: String,
    email:String,
    password: String,
    phone:String,
    dateOfBirth:Date,
    role:{default:false,type:Boolean}
  },
  { timestamps: true }
);

export default mongoose.model('users', user);
