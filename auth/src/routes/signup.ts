import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    console.log("creating user");
    console.log({ email, password });
    throw new DatabaseConnectionError();

    // return res.json({});
  }
);

export { router as signUpRouter };
