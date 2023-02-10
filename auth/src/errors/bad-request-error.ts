import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  reason: string;

  constructor(reason = "Something went wrong") {
    super(reason);
    this.reason = reason;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeError(): ErrorResponse {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
