import { Router } from "express";
import dotenv from "dotenv";
import animationModel from "./../Model/animation.js";

dotenv.config();

const animationRoute = Router();
//============POST==============//
animationRoute.post("/addAnimation", async (req, res) => {
  const { ...animation } = req.body;
  const isExists = await animationModel.findOne(
    { nameAnimation: animation?.nameAnimation },
    { _id: 0, Ameanimation: 1 }
  );

  if (!isExists) {
    animationModel.create({ ...animation }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("animation exist");
  }
});

//============GET==============//
animationRoute.get("/getList", async (req, res) => {
  try {
    let page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      let skip = (page - 1) * PAGE_SIZE;
      animationModel
        .find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.json(data);
        });
    } else {
      const animationList = await animationModel.find(
        {},
        {
          nameAnimation: 1,
          _id: 0,
        }
      );
      res.send(animationList);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
animationRoute.delete("/:nameAnimation", async (req, res) => {
  try {
    const { nameAnimation } = req.params;
    const result = await animationModel.deleteOne({ nameAnimation });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("nameAnimation does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default animationRoute;
