import { Router } from "express";
import dotenv from "dotenv";
import bangoiModel from "./../Model/bangoi.js";
import roomModel from "./../Model/room.js";
import theaterModel from "./../Model/theater.js";
dotenv.config();

const bangoiRoute = Router();

//============POST==============//
bangoiRoute.post("/addBaNgoi", async (req, res) => {
  const { ...bangoi } = req.body;
  console.log(bangoi);
  //   const isExists = await billModel.findOne(
  //     { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
  //     { _id: 0, nameRoom: 1 }
  //   );

  //   if (!isExists) {
  bangoiModel.create({ ...bangoi }, (err) => {
    if (err) res.sendStatus(500);
    return res.send({ type: "success" });
  });
  //   } else {
  //     return res.status(400).send("bill exist");
  //   }
});

//============GET==============//
bangoiRoute.get("/:timeStart", async (req, res) => {
  try {
    const { timeStart } = req.params;
    const bangois = await bangoiModel.find(
      { timeStart: timeStart },
      {
        _id: 1,
        idRoom: 1,
        idFilm: 1,
        timeStart: 1,
      }
    );
    const idRoom = bangois.map((bangoi) => bangoi.idRoom);
    const rooms = await roomModel.find(
      { _id: idRoom },
      {
        _id: 1,
        nameRoom: 1,
        rows: 1,
        columns: 1,
        idTheater: 1,
        left: 1,
        right: 1,
      }
    );
    const idTheater = rooms.map((room) => room.idTheater);
    const theaters = await theaterModel.find(
      { _id: idTheater },
      {
        idArea: 1,
        nameTheater: 1,
        _id: 1,
        address: 1,
      }
    );
    const finalData = bangois.map((bangoi) => {
      rooms.some((room) => {
        if (room._id.toString() === bangoi._doc.idRoom) {
          bangoi._doc.idTheater = room.idTheater;
          bangoi._doc.nameRoom = room.nameRoom;
          bangoi._doc.columns = room.columns;
          bangoi._doc.rows = room.rows;
          bangoi._doc.left = room.left;
          bangoi._doc.right = room.right;
          return true;
        }
        return false;
      });
      theaters.some((theater) => {
        if (theater._id.toString() === bangoi._doc.idTheater) {
          bangoi._doc.nameTheater = theater.nameTheater;
          return true;
        }
        return false;
      });
      return bangoi;
    });
    res.send(finalData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default bangoiRoute;
