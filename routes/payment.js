import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
const paymentRoute = Router();

paymentRoute.get("/config", async (req, res) => {
  return res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_ID,
  });
});

export default paymentRoute;
