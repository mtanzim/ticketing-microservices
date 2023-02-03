import { NextFunction, Request, Response } from "express";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log("handling request error");
    return res.status(400).send({
      message: err.message,
      reasons: err.errors,
    });
  }
  if (err instanceof DatabaseConnectionError) {
    console.log("handling db connection error error");
    return res.status(400).send({
      message: err.message,
      reasons: err.reasons,
    });
  }
  return res.status(400).send({
    message: "Something went wrong",
    reasons: [],
  });
};
