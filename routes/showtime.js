import { Router } from "express";
import showtimeModel from "../Model/showtime.js";
import dotenv from "dotenv";
dotenv.config();
const PAGE_SIZE = 2;

const showtimeRoute = Router();

//============POST==============//
showtimeRoute.post("/addShowTime", async (req, res) => {
  const { ...showtime } = req.body;

  const isExists = await showtimeModel.findOne(
    { timeStart: showtime?.timeStart, idFilm: showtime?.idFilm },
    { _id: 0, time: 1 }
  );

  if (!isExists) {
    showtimeModel.create({ ...showtime }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("showtime exist");
  }
});

//============GET==============//
showtimeRoute.get("/getList", async (req, res) => {
  try {
    let page = req.query.page;
    if (page) {
      page = parseInt(page);
      if (page < 1) {
        page = 1;
      }
      let skip = (page - 1) * PAGE_SIZE;
      showtimeModel
        .find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.json(data);
        });
    } else {
      const showtimeList = await showtimeModel.find(
        {},
        {
          price: 1,
          timeStart: 1,
          _id: 1,
          date: 1,
          time: 1,
          idFilm: 1,
          idRoom: 1,
          idArea: 1,
          idTheater: 1,
          idAnimation: 1,
        }
      );
      res.send(showtimeList);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

showtimeRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const showtime = await showtimeModel.find(
      { idFilm: id },
      {
        price: 1,
        timeStart: 1,
        _id: 1,
        date: 1,
        time: 1,
        idFilm: 1,
        idRoom: 1,
        idArea: 1,
        idTheater: 1,
        idAnimation: 1,
      }
    );
    res.send(showtime);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============DELETE==============//
showtimeRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await showtimeModel.deleteOne({ id });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("id does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

//============PUT==============//
showtimeRoute.put("/:id", async (req, res) => {
  try {
    const user = await showtimeModel.findOneAndUpdate(
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
          trailer: req.body.trailer,
        },
      }
    );
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default showtimeRoute;
