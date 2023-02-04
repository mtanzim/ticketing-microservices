import { ValidationError } from "express-validator";
import { ErrorResponse } from "../middleware/error-handler";
import { FormattedError } from "./interface";

export class RequestValidationError extends Error implements FormattedError {
  readonly errors: ValidationError[] = [];
  constructor(errors: ValidationError[]) {
    super();
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
