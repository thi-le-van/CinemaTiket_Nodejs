import { Router } from "express";
import dotenv from "dotenv";
import roomModel from "./../Model/room.js";
dotenv.config();
const roomRoute = Router();

//============POST==============//
roomRoute.post("/addRoom", async (req, res) => {
  const { ...room } = req.body;
  const isExists = await roomModel.findOne(
    { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
    { _id: 0, nameRoom: 1 }
  );

  if (!isExists) {
    roomModel.create({ ...room }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("room exist");
  }
});

//============GET==============//
roomRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomModel.find(
      { idTheater: id },
      {
        idTheater: 1,
        nameRoom: 1,
        _id: 1,
        columns: 1,
        rows: 1,
        left: 1,
        right: 1,
      }
    );
    res.send(room);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

roomRoute.get("/getId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const room = await roomModel.find(
      { _id: id },
      {
        idTheater: 1,
        nameRoom: 1,
        _id: 1,
        columns: 1,
        rows: 1,
        left: 1,
        right: 1,
      }
    );
    res.send(room);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
roomRoute.delete("/:nameRoom", async (req, res) => {
  try {
    const { nameRoom } = req.params;
    const result = await roomModel.deleteOne({ nameRoom });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("Room does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default roomRoute;
