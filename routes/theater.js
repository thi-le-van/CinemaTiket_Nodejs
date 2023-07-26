import { Router } from "express";
import theaterModel from "../Model/theater.js";

import dotenv from "dotenv";
import areaModel from "../Model/area.js";
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
    const theaters = await theaterModel.find(
      { idArea: id },
      {
        idArea: 1,
        nameTheater: 1,
        _id: 1,
        address: 1,
      }
    );
    const idArea = theaters.map((theater) => theater.idArea);
    const areas = await areaModel.find(
      {
        _id: idArea,
      },
      {
        _id: 1,
        nameArea: 1,
      }
    );
    const finalData = theaters.map((theater) => {
      areas.some((area) => {
        if (area._id.toString() === theater.idArea) {
          theater._doc.nameArea = area.nameArea;
          return true;
        }
        return false;
      });

      return theater;
    });
    res.send(finalData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

theaterRoute.get("/getId/:id", async (req, res) => {
  try {
    const theater = await theaterModel.find(
      {},
      {
        idArea: 1,
        nameTheater: 1,
        _id: 1,
        address: 1,
      }
    );
    const idArea = theaters.map((theater) => theater.idArea);
    const areas = await areaModel.find(
      {
        _id: idArea,
      },
      {
        _id: 1,
        nameArea: 1,
      }
    );
    const finalData = theaters.map((theater) => {
      areas.some((area) => {
        if (area._id.toString() === theater.idArea) {
          theater._doc.nameArea = area.nameArea;
          return true;
        }
        return false;
      });

      return theater;
    });
    res.send(finalData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
theaterRoute.delete("/:nameTheater", async (req, res) => {
  try {
    const { nameTheater } = req.params;
    const result = await theaterModel.deleteOne({ nameTheater });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("nameTheater does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
//============PUT==============//
theaterRoute.put("/:nameTheater", async (req, res) => {
  try {
    const theater = await theaterModel.findOneAndUpdate(
      { _nameTheater: req.params },
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
