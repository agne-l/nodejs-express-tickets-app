import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRouter from "./routes/user.js";
import ticketRouter from "./routes/ticket.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/tickets", ticketRouter);

mongoose
  // eslint-disable-next-line no-undef
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

// eslint-disable-next-line no-undef
app.listen(process.env.PORT, () => {
  console.log("app started");
});
