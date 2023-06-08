import { Router } from "express";
import dotenv from "dotenv";
import billModel from "./../Model/bill.js";
dotenv.config();

const billRoute = Router();

//============POST==============//
billRoute.post("/addBill", async (req, res) => {
  const { ...bill } = req.body;
  //   const isExists = await billModel.findOne(
  //     { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
  //     { _id: 0, nameRoom: 1 }
  //   );

  //   if (!isExists) {
  billModel.create({ ...bill }, (err) => {
    if (err) res.sendStatus(500);
    return res.send({ type: "success" });
  });
  //   } else {
  //     return res.status(400).send("bill exist");
  //   }
});

export default billRoute;
