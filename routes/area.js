import { Router } from "express";
import areaModel from "../Model/area.js";
import myJson from "../city.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const areaRoute = Router();
areaRoute.get("/getAreaJson", async (req, res) => {
  try {
    res.send(myJson);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============POST==============//
areaRoute.post("/addArea", async (req, res) => {
  const { ...area } = req.body;
  const isExists = await areaModel.findOne(
    { nameArea: area?.nameArea },
    { _id: 1, nameArea: 1 }
  );

  if (!isExists) {
    areaModel.create({ ...area }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("area exist");
  }
});
//============GET==============//
areaRoute.get("/getList", async (req, res) => {
  try {
    const areaList = await areaModel.find(
      {},
      {
        nameArea: 1,
        _id: 1,
      }
    );
    res.send(areaList);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
areaRoute.delete("/:nameArea", async (req, res) => {
  try {
    const { nameArea } = req.params;
    const result = await areaModel.deleteOne({ nameArea });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("email does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default areaRoute;
