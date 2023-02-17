import { BadRequestError, validateRequest } from "@tm-tickets-1989/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be supplied"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError();
    }

    const passwordMatched = await Password.compare(user.password, password);
    if (!passwordMatched) {
      throw new BadRequestError();
    }
    const secret = process.env?.["JWT_KEY"];
    // env var checked in index.ts
    const userJwt = jwt.sign({ id: user.id, email: user.email }, secret!);
    req.session = { jwt: userJwt };

    return res.status(200).json(user);
  }
);

export { router as signInRouter };
