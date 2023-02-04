import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export type ErrorResponse = {
  errors: Array<{ message: string; field?: string }>;
};

export interface FormattedError {}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeError());
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
