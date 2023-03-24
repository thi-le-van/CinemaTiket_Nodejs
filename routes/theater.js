import { Router } from "express";
import theaterModel from "../Model/theater.js";

import dotenv from "dotenv";
dotenv.config();

const theaterRoute = Router();
//============POST==============//
theaterRoute.post("/addTheater", async (req, res) => {
  const { ...theater } = req.body;
  const isExists = await theaterModel.findOne(
    { nameTheater: theater?.nameTheater },
    { _id: 0, nameTheater: 1 }
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
theaterRoute.get("/getList", async (req, res) => {
  try {
    let page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      let skip = (page - 1) * PAGE_SIZE;
      theaterModel
        .find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.json(data);
        });
    } else {
      const theaterList = await theaterModel.find(
        {},
        {
          nameTheater: 1,
          _id: 0,
          location: 1,
        }
      );
      res.send(theaterList);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
theaterRoute.delete("/delete/:index", async (req, res) => {
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
export default theaterRoute;
