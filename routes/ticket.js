import express from "express";
import {
  CREATE_TICKET,
  BUY_TICKET,
  GET_ALL_TICKETS,
} from "../controller/ticket.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, CREATE_TICKET);
router.get("/", auth, GET_ALL_TICKETS);
router.post("/:id/buy", auth, BUY_TICKET);

export default router;
