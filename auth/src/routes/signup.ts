import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("user already exists!");
    }
    const hashedPassword = password;
    const user = User.build({ email, password: hashedPassword });
    await user.save();

    const secret = process.env?.["JWT_KEY"];
    // env var checked in index.ts
    const userJwt = jwt.sign({ id: user.id, email: user.email }, secret!);
    req.session = { jwt: userJwt };

    return res.status(201).json({
      email: user.email,
      id: user._id,
    });
  }
);

export { router as signUpRouter };
