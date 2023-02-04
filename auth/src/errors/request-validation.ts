import { ValidationError } from "express-validator";
import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  readonly errors: ValidationError[] = [];
  statusCode = 400;
  constructor(errors: ValidationError[]) {
    super("invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
    this.errors = errors;
  }

  serializeError(): ErrorResponse {
    const formattedErrors = this.errors.map((e) => ({
      message: e.msg,
      field: e.param,
    }));
    return { errors: formattedErrors };
  }
}
