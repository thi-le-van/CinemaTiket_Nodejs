import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./db.js";
import server from "./server.js";
import {
  movieRoute,
  authRoute,
  userRoute,
  theaterRoute,
  categoryRoute,
  areaRoute,
} from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
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
