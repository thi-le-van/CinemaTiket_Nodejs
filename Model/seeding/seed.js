import mongoose from "mongoose";
import user from "./Model/user.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

async function hashPassword(pass) {
  const password = await bcrypt.hash(pass, saltRounds);
  return password;
}

if (process.env.MONGODB_CONNECT) {
  mongoose.connect(process.env.MONGODB_CONNECT);

  const admin = {
    name: "ADMIN",
    email: process.env.TKADMIN,
    password: hashPassword(process.env.MKADMIN),
    phone: "0123456789",
    role: true,
  };

  const seedDB = async () => {
    if (!admin.email) {
      await user.insert(admin);
    }
  };
  seedDB().then(() => {
    mongoose.connection.close();
  });
}
