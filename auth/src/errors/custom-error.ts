import { ErrorResponse } from "../middleware/error-handler";

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeError(): ErrorResponse;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
