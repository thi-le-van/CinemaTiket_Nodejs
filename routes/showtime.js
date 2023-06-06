import { Router } from "express";
import showtimeModel from "../Model/showtime.js";
import roomModel from "../Model/room.js";
import theaterModel from "../Model/theater.js";
import dotenv from "dotenv";

dotenv.config();
const PAGE_SIZE = 2;

const showtimeRoute = Router();

//============POST==============//
showtimeRoute.post("/addShowTime", async (req, res) => {
  const { ...showtime } = req.body;

  const isExists = await showtimeModel.findOne(
    { timeStart: showtime?.timeStart },
    { _id: 0, timeStart: 1 }
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
          idFilm: 1,
          idRoom: 1,
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
    const showTimes = await showtimeModel.find(
      { idFilm: id },
      {
        _id: 1,
        price: 1,
        timeStart: 1,
        date: 1,
        idFilm: 1,
        idRoom: 1,
      }
    );

    const idRoom = showTimes.map((showtime) => showtime.idRoom);
    const rooms = await roomModel.find(
      { _id: idRoom },
      {
        _id: 1,
        nameRoom: 1,
        rows: 1,
        columns: 1,
        idTheater: 1,
      }
    );
    const idTheater = rooms.map((room) => room.idTheater);
    const theaters = await theaterModel.find(
      { _id: idTheater },
      {
        idArea: 1,
        nameTheater: 1,
        _id: 1,
        address: 1,
      }
    );
    const finalData = showTimes.map((showTime) => {
      rooms.some((room) => {
        if (room._id.toString() === showTime.idRoom) {
          showTime._doc.idTheater = room.idTheater;
          showTime._doc.nameRoom = room.nameRoom;
          return true;
        }
        return false;
      });
      theaters.some((theater) => {
        if (theater._id.toString() === showTime._doc.idTheater) {
          showTime._doc.nameTheater = theater.nameTheater;
          return true;
        }
        return false;
      });

      return showTime;
    });
    res.send(finalData);
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
