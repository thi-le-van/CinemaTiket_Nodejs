import { Router } from "express";

import dotenv from "dotenv";
import ticketModel from './../Model/ticket.js';
import showtimeModel from "../Model/showtime.js";
import movieModel from './../Model/movie.js';
import roomModel from './../Model/room.js';
import theaterModel from './../Model/theater.js'
dotenv.config();

const ticketRoute = Router();
//============POST==============//
ticketRoute.post("/addTicket", async (req, res) => {
  const { ...ticket } = req.body;
  const isExists = await ticketModel.findOne(
    { _id: ticket?._id,  },
    {  _id: 1 }
  );

  if (!isExists) {
    ticketModel.create({ ...ticket }, (err) => {
      if (err) res.sendStatus(500);
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("ticket exist");
  }
});

//============GET==============//

ticketRoute.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const tickets = await ticketModel.find(
      { email: email },
      {
        price: 1,
        idShowTime: 1,
        chairs:1,
        email:1,
        _id: 1,
        checkout: 1,
        expireAt:1
      }
    );
    const idShowTime = tickets.map(showTime=>showTime.idShowTime)
    const showTimes = await showtimeModel.find({
      _id:idShowTime
    },{
      _id: 1,
        price: 1,
        timeStart: 1,
        date: 1,
        idFilm: 1,
        idRoom: 1,
    })
    const idFilm = showTimes.map(showTime=>showTime.idFilm)
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
    const idRoom = showTimes.map(showTime=>showTime.idRoom)
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
   
    const finalData = tickets.map((ticket) => {
      showTimes.some((showTime) => {
        if (showTime._id.toString() === ticket.idShowTime) {
          ticket._doc.date = showTime.date;
          ticket._doc.timeStart = showTime.timeStart;
          ticket._doc.idFilm= showTime.idFilm;
          ticket._doc.idRoom = showTime.idRoom
          return true;
        }
        return false;
      });
      films.some((film)=>{
        if(film._id.toString()===ticket._doc.idFilm){
         ticket._doc.time = film.time;
         ticket._doc.picture = film.picture;
         ticket._doc.nameFilm = film.nameFilm;
          return true;
        }
        return false
      })
      
      rooms.some((room) => {
        if (room._id.toString() === ticket._doc.idRoom) {
          ticket._doc.idTheater = room.idTheater;
          ticket._doc.nameRoom = room.nameRoom;
          return true;
        }
        return false;
      });
      theaters.some((theater) => {
        if (theater._id.toString() === ticket._doc.idTheater) {
          ticket._doc.nameTheater = theater.nameTheater;
          return true;
        }
        return false;
      });
      return ticket;
    });
     res.send(finalData)
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});


//============DELETE==============//

//============PUT==============//
ticketRoute.put("/:id", async (req, res) => {
  try {
    const ticket = await ticketModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          checkout: true,
          "expireAt" : new Date().setFullYear(2030),
        },
      }
    );
    
    res.send(ticket);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});
export default ticketRoute;
