import { Router } from "express";
import dotenv from "dotenv";
import detailTicketModel from "./../Model/detailticket.js";
dotenv.config();

const detailTicketRoute = Router();

//============POST==============//
detailTicketRoute.post("/addDetailTicket", async (req, res) => {
  const { ...detailTicket } = req.body;
  // const isExists = await detailTicketModel.findOne(
  //   { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
  //   { _id: 0, nameRoom: 1 }
  // );

  // if (!isExists) {
  detailTicketModel.create({ ...detailTicket }, (err) => {
    if (err) res.sendStatus(500);
    return res.send({ type: "success" });
  });
  // } else {
  //   return res.status(400).send("room exist");
  // }
});

//============GET==============//
detailTicketRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const detailTicket = await detailTicketModel.find(
      { idShowTime: id },
      {
        idTicket: 1,
        idShowTime: 1,
        email: 1,
        date: 1,
        detail: 1,
        checkout: 1,
      }
    );
    res.send(detailTicket);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//

//============PUT==============//
detailTicketRoute.put("/:id", async (req, res) => {
  try {
    console.log(req.body.idTicket);
    const ticket = await detailTicketModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          idTicket: req.body.idTicket,
          checkout: true,
          expireAt: new Date().setFullYear(2030),
        },
      }
    );

    res.send(ticket);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default detailTicketRoute;
