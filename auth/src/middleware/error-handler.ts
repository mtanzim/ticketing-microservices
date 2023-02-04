import { NextFunction, Request, Response } from "express";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation";

type ErrorResponse = {
  errors: Array<{ message: string; field?: string }>;
};
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ERR_STATUS_CODE = 400;

  if (err instanceof RequestValidationError) {
    console.log("handling request error");
    const formattedErrors = err.errors.map((e) => ({
      message: e.msg,
      field: e.param,
    }));
    const errRes: ErrorResponse = { errors: formattedErrors };
    return res.status(ERR_STATUS_CODE).send(errRes);
  }
  if (err instanceof DatabaseConnectionError) {
    console.log("handling db connection error error");
    const errRes: ErrorResponse = {
      errors: [
        {
          message: err.reasons,
        },
      ],
    };
    return res.status(ERR_STATUS_CODE).send(errRes);
  }

  const defaultError: ErrorResponse = {
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  };
  return res.status(ERR_STATUS_CODE).send(defaultError);
};
