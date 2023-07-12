import { Router } from "express";
import movieModel from "../Model/movie.js";
import dotenv from "dotenv";
dotenv.config();

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
    const movieList = await movieModel.find(
      {},
      {
        nameFilm: 1,
        _id: 1,
        date: 1,
        time: 1,
        picture: 1,
        animation: 1,
        directors: 1,
        actors: 1,
        content: 1,
        genres: 1,
        trailer: 1,
      }
    );
    res.send(movieList);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

movieRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.findOne(
      { _id: id },
      {
        nameFilm: 1,
        _id: 1,
        date: 1,
        time: 1,
        picture: 1,
        directors: 1,
        actors: 1,
        animation: 1,
        content: 1,
        genres: 1,
        trailer: 1,
      }
    );
    res.send(movie);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
movieRoute.delete("/:nameFilm", async (req, res) => {
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
movieRoute.put("/:id", async (req, res) => {
  try {
    const user = await movieModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          nameFilm: req.body.nameFilm,
          date: req.body.date,
          time: req.body.time,
          picture: req.body.picture,
          directors: req.body.directors,
          actors: req.body.actors,
          content: req.body.content,
          genres: req.body.genres,
          animation: req.body.animation,
          trailer: req.body.trailer,
        },
      }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default movieRoute;
