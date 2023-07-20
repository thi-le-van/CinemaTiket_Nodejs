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
      { email: 1, _id: 1, name: 1, phone: 1, dateOfBirth: 1, role: 1 }
    );
    res.send(userList);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

userRoute.get("/getUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne(
      { _id: id },
      { email: 1, _id: 1, name: 1, phone: 1, dateOfBirth: 1 }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
userRoute.delete("/:id", authorizationMiddleWare, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserModel.deleteOne({ id });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("id does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============PUT==============//
userRoute.put("/:id", async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          dateOfBirth: req.body.dateOfBirth,
        },
      }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default userRoute;
