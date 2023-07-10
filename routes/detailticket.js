import { Router } from "express";
import dotenv from "dotenv";
import detailTicketModel from "./../Model/detailticket.js";
import ticketModel from "./../Model/ticket.js";
import showtimeModel from "../Model/showtime.js";
import movieModel from "./../Model/movie.js";
import roomModel from "./../Model/room.js";
import theaterModel from "./../Model/theater.js";
dotenv.config();

const detailTicketRoute = Router();

//============POST==============//
detailTicketRoute.post("/addDetailTicket", async (req, res) => {
  const { ...detailTicket } = req.body;
  // const isExists = await detailTicketModel.findOne(
  //   { nameRoom: room?.nameRoom, idTheater: room?.idTheater },
  //   { _id: 0, nameRoom: 1 }
  // );

  // if (!isExists) {
  detailTicketModel.create({ ...detailTicket }, (err) => {
    if (err) res.sendStatus(500);
    return res.send({ type: "success" });
  });
  // } else {
  //   return res.status(400).send("room exist");
  // }
});

//============GET==============//
detailTicketRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const detailTicket = await detailTicketModel.find(
      { idShowTime: id },
      {
        idTicket: 1,
        idShowTime: 1,
        email: 1,
        date: 1,
        detail: 1,
        checkout: 1,
      }
    );
    res.send(detailTicket);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

detailTicketRoute.get("/getDetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bills = await detailTicketModel.find(
      { idTicket: id },
      {
        idTicket: 1,
        idShowTime: 1,
        email: 1,
        date: 1,
        detail: 1,
        checkout: 1,
      }
    );
    const tickets = await ticketModel.find(
      {
        _id: id,
      },
      { price: 1, idShowTime: 1, chairs: 1, email: 1, _id: 1 }
    );
    const idShowTime = tickets.map((showTime) => showTime.idShowTime);
    const showTimes = await showtimeModel.find(
      {
        _id: idShowTime,
      },
      {
        _id: 1,
        price: 1,
        timeStart: 1,
        date: 1,
        idFilm: 1,
        idRoom: 1,
      }
    );
    const idFilm = showTimes.map((showTime) => showTime.idFilm);
    const films = await movieModel.find(
      { _id: idFilm },
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
    const idRoom = showTimes.map((showTime) => showTime.idRoom);
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
    const finalData = bills.map((bill) => {
      tickets.some((ticket) => {
        if (ticket._id.toString() === bill.idTicket) {
          bill._doc.price = ticket.price;
          bill._doc.chairs = ticket.chairs;
          bill._doc.idShowTime = ticket.idShowTime;
          return true;
        }
        return false;
      });
      showTimes.some((showTime) => {
        if (showTime._id.toString() === bill._doc.idShowTime) {
          bill._doc.date = showTime.date;
          bill._doc.timeStart = showTime.timeStart;
          bill._doc.idFilm = showTime.idFilm;
          bill._doc.idRoom = showTime.idRoom;
          return true;
        }
        return false;
      });
      films.some((film) => {
        if (film._id.toString() === bill._doc.idFilm) {
          bill._doc.time = film.time;
          bill._doc.nameFilm = film.nameFilm;
          return true;
        }
        return false;
      });
      rooms.some((room) => {
        if (room._id.toString() === bill._doc.idRoom) {
          bill._doc.idTheater = room.idTheater;
          bill._doc.nameRoom = room.nameRoom;
          return true;
        }
        return false;
      });
      theaters.some((theater) => {
        if (theater._id.toString() === bill._doc.idTheater) {
          bill._doc.nameTheater = theater.nameTheater;
          return true;
        }
        return false;
      });
      return bill;
    });
    res.send(finalData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
//============DELETE==============//
detailTicketRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await detailTicketModel.deleteOne({ id });
    if (result.deletedCount) {
      return res.send("Success");
    }
    res.status(400).send("DetailTicket does not exist.");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
//============PUT==============//
detailTicketRoute.put("/:id", async (req, res) => {
  try {
    const ticket = await detailTicketModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          idTicket: req.body.idTicket,
          checkout: true,
          expireAt: new Date().setFullYear(2030),
        },
      }
    );

    res.send(ticket);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
export default detailTicketRoute;
