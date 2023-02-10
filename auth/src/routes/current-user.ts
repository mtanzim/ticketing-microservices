import express from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    return res.json({ currentUser: null });
  }
  const secret = process.env?.["JWT_KEY"];
  try {
    const payload = jwt.verify(req.session.jwt, secret!);
    return res.json({ currentUser: payload });
  } catch (err: any) {
    throw new BadRequestError(err?.message || "Something went wrong");
  }
});

export { router as currentUserRouter };
