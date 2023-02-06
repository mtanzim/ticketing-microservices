import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  reason = "Invalid request sent";

  constructor(reason: string) {
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
