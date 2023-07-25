import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./db.js";
import server from "./server.js";
import seedData from "./Controller/seedData.js";

import {
  movieRoute,
  authRoute,
  userRoute,
  theaterRoute,
  categoryRoute,
  areaRoute,
  roomRoute,
  animationRoute,
  showtimeRoute,
  ticketRoute,
  detailticketRoute,
  chairRoute,
  paymentRoute,
  bangoiRoute,
} from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
seedData();
app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
  })
);
//starting server
server(app);

app.use("/movie", movieRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/theater", theaterRoute);
app.use("/category", categoryRoute);
app.use("/area", areaRoute);
app.use("/room", roomRoute);
app.use("/animation", animationRoute);
app.use("/showtime", showtimeRoute);
app.use("/ticket", ticketRoute);
app.use("/chair", chairRoute);
app.use("/detailticket", detailticketRoute);
app.use("/payment", paymentRoute);
app.use("/bangoi", bangoiRoute);
