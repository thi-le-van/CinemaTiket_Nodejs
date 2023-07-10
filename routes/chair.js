import { Router } from "express";
import dotenv from "dotenv";
import chairModel from "./../Model/chair.js";
dotenv.config();

const chairRoute = Router();

//============POST==============//
chairRoute.post("/addChair", async (req, res) => {
  const { ...chair } = req.body;
  // const isExists = await chairModel.findOne(
  //   { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
  //   { _id: 0, nameRoom: 1 }
  // );

  // if (!isExists) {
  chairModel.create({ ...chair }, (err) => {
    if (err) res.sendStatus(500);
    return res.send({ type: "success" });
  });
  // } else {
  //   return res.status(400).send("room exist");
  // }
});

//============GET==============//
chairRoute.get("/:idRoom", async (req, res) => {
  try {
    const { idRoom } = req.params;
    const chair = await chairModel.find(
      { idRoom: idRoom },
      {
        idRoom: 1,
        numberChair: 1,
        _id: 1,
      }
    );
    res.send(chair);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
chairRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await chairModel.deleteOne({ id });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("Chair does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
//============PUT==============//
chairRoute.put("/:id", async (req, res) => {
  try {
    const chair = await chairModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          checkout: true,
          expireAt: new Date().setFullYear(2030),
        },
      }
    );

    res.send(chair);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default chairRoute;
