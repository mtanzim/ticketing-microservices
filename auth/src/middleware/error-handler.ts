import { NextFunction, Request, Response } from "express";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation";

export type ErrorResponse = {
  errors: Array<{ message: string; field?: string }>;
};
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log("handling request error");

    return res.status(400).send(err.serializeError());
  }
  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send(err.serializeError());
  }

  const defaultError: ErrorResponse = {
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  };
  return res.status(400).send(defaultError);
};
