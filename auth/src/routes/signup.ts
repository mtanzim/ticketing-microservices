import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middleware/validate-request";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("invalid email supplied"),
    body("password")
      .trim()
      .isLength({ max: 20, min: 4 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("user already exists!");
    }
    const user = User.build({ email, password });
    await user.save();

    const secret = process.env?.["JWT_KEY"];
    // env var checked in index.ts
    const userJwt = jwt.sign({ id: user.id, email: user.email }, secret!);
    req.session = { jwt: userJwt };

    return res.status(201).json(user);
  }
);

export { router as signUpRouter };
