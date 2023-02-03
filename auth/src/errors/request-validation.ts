import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  readonly errors: ValidationError[] = [];
  constructor(errors: ValidationError[]) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
    this.errors = errors;
  }
}
