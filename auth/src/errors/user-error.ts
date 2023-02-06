import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class UserError extends CustomError {
  statusCode = 400;
  reason = "Something went wrong with the user";

  constructor(reason: string) {
    super(reason);
    this.reason = reason;
    Object.setPrototypeOf(this, UserError.prototype);
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
