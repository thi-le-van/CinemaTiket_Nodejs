import { Router } from "express";
import movieModel from "../Model/movie.js";
import dotenv from "dotenv";
dotenv.config();
const PAGE_SIZE = 2;

const movieRoute = Router();

//============POST==============//
movieRoute.post("/addfilm", async (req, res) => {
  const { ...movie } = req.body;
  const isExists = await movieModel.findOne(
    { nameFilm: movie?.nameFilm },
    { _id: 0, nameFilm: 1 }
  );

  if (!isExists) {
    movieModel.create({ ...movie }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("movie exist");
  }
});

//============GET==============//
movieRoute.get("/getList", async (req, res) => {
  try {
    let page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      let skip = (page - 1) * PAGE_SIZE;
      movieModel
        .find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.json(data);
        });
    } else {
      const movieList = await movieModel.find(
        {},
        {
          nameFilm: 1,
          _id: 0,
          date: 1,
          time: 1,
          directors: 1,
          actors: 1,
          content: 1,
          genres: 1,
        }
      );
      res.send(movieList);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
movieRoute.delete("/delete/:nameFilm", async (req, res) => {
  try {
    const { nameFilm } = req.params;
    const result = await movieModel.deleteOne({ nameFilm });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("nameFilm does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============PUT==============//
export default movieRoute;
