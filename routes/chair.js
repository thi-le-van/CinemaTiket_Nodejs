import { Router } from "express";
import dotenv from "dotenv";
import chairModel from "./../Model/chair.js";
dotenv.config();

const chairRoute = Router();

//============POST==============//
chairRoute.post("/addChair", async (req, res) => {
  const { ...room } = req.body;
  const isExists = await chairModel.findOne(
    { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
    { _id: 0, nameRoom: 1 }
  );

  if (!isExists) {
    chairModel.create({ ...room }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("room exist");
  }
});

//============GET==============//
// chairRoute.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const room = await chairModel.find(
//       { idTheater: id },
//       {
//         idTheater: 1,
//         nameRoom: 1,
//         _id: 1,
//       }
//     );
//     res.send(room);
//   } catch (error) {
//     res.status(500).send("Internal server error");
//   }
// });

//============DELETE==============//
// chairRoute.delete("/:nameRoom", async (req, res) => {
//   try {
//     const { nameRoom } = req.params;
//     const result = await chairModel.deleteOne({ nameRoom });
//     if (result.deletedCount) {
//       return res.send("Success");
//     }
//     res.status(400).send("Room does not exist.");
//   } catch (error) {
//     res.status(500).send("Internal server error");
//   }
// });
export default chairRoute;
