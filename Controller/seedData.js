import UserAdmin from "../Model/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;
const seedData = () => {
  if (process.env.MONGODB_CONNECT) {
    mongoose.connect(process.env.MONGODB_CONNECT);
    UserAdmin.findOne({ email: process.env.TK_ADMIN }).then((user) => {
      if (!user) {
        bcrypt.hash(
          process.env.MK_ADMIN,
          saltRounds,
          async function (err, hash) {
            if (err) throw err;
            const model = new UserAdmin({
              email: process.env.TK_ADMIN,
              name: "Admin Web",
              password: hash,
              role: true,
            });
            return await model.save();
          }
        );
      }
    });
  }
};

export default seedData;
