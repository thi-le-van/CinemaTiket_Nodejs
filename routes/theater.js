import { Router } from "express";
import theaterModel from "../Model/theater.js";

import dotenv from "dotenv";
dotenv.config();

const theaterRoute = Router();
//============POST==============//
theaterRoute.post("/addTheater", async (req, res) => {
  const { ...theater } = req.body;
  const isExists = await theaterModel.findOne(
    { idArea: theater?.idArea, nameTheater: theater?.nameTheater },
    { nameTheater: 1, idArea: 1 }
  );

  if (!isExists) {
    theaterModel.create({ ...theater }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("theater exist");
  }
});

//============GET==============//
theaterRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const theaterList = await theaterModel.find(
      { idArea: id },
      {
        idArea: 1,
        nameTheater: 1,
        _id: 1,
        address: 1,
      }
    );
    res.send(theaterList);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

theaterRoute.get("/getId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const theater = await theaterModel.find(
      { _id: id },
      {
        idArea: 1,
        nameTheater: 1,
        _id: 1,
        address: 1,
      }
    );
    res.send(theater);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
theaterRoute.delete("/:index", async (req, res) => {
  try {
    const { index } = req.params;
    const result = await theaterModel.deleteOne({ index });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("nameTheater does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
//============PUT==============//
theaterRoute.put("/:id", async (req, res) => {
  try {
    const theater = await theaterModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          nameTheater: req.body.nameTheater,
          address: req.body.address,
        },
      }
    );
    res.send(theater);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default theaterRoute;
