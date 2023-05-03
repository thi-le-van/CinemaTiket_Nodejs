import { Router } from "express";
import categoryModel from "../Model/category.js";

import dotenv from "dotenv";
dotenv.config();

const categoryRoute = Router();
//============POST==============//
categoryRoute.post("/addCategory", async (req, res) => {
  const { ...category } = req.body;
  const isExists = await categoryModel.findOne(
    { nameCategory: category?.nameCategory },
    { _id: 0, nameCategory: 1 }
  );

  if (!isExists) {
    categoryModel.create({ ...category }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("category exist");
  }
});

//============GET==============//
categoryRoute.get("/getList", async (req, res) => {
  try {
    let page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      let skip = (page - 1) * PAGE_SIZE;
      categoryModel
        .find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.json(data);
        });
    } else {
      const categoryList = await categoryModel.find(
        {},
        {
          nameCategory: 1,
          _id: 0,
        }
      );
      res.send(categoryList);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
categoryRoute.delete("/:index", async (req, res) => {
  try {
    const { index } = req.params;
    const result = await categoryModel.deleteOne({ index });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("nameCategory does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default categoryRoute;
