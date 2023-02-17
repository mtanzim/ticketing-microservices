import { currentUser } from "@tm-tickets-1989/common";
import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.json({ currentUser: req?.currentUser || null });
});

export { router as currentUserRouter };
