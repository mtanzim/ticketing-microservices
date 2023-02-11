import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Unauthorized");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  serializeError(): ErrorResponse {
    return {
      errors: [
        {
          message: "Unauthorized",
        },
      ],
    };
  }
}
