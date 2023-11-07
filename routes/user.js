import express from "express";
import {
  SIGNUP,
  LOGIN,
  GET_NEW_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controller/user.js";
import verifyRefreshToken from "../middleware/verifyRefreshToken.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", SIGNUP);
router.post("/login", LOGIN);
router.post("/refresh", verifyRefreshToken, GET_NEW_TOKEN);
router.get("/", auth, GET_ALL_USERS);
router.get("/tickets", auth, GET_ALL_USERS_WITH_TICKETS);
router.get("/:id", auth, GET_USER_BY_ID);
router.get("/:id/tickets", auth, GET_USER_BY_ID_WITH_TICKETS);

export default router;
