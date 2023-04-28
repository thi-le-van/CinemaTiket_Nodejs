import { Router } from "express";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();
import authorizationMiddleWare from "../Middleware/authorization.js";
import UserModel from "../Model/user.js";

const userRoute = Router();

//============GET==============//
userRoute.get("/getList", authorizationMiddleWare, async (req, res) => {
  try {
    const userList = await UserModel.find(
      {},
      { email: 1, _id: 0, name: 1, phone: 1, dateOfBirth: 1 }
    );
    res.send(userList);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

userRoute.get("/getUser/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne(
      { email: email },
      { email: 1, _id: 1, name: 1, phone: 1, dateOfBirth: 1 }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
userRoute.delete(
  "/delete/:email",
  authorizationMiddleWare,
  async (req, res) => {
    try {
      const { email } = req.params;
      const result = await UserModel.deleteOne({ email });
      if (result.deletedCount) {
        return res.send("Success");
      }
      res.status(400).send("email does not exist.");
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

export default userRoute;
