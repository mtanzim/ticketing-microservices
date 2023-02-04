import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("fallback error");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): ErrorResponse {
    const formattedErrors = [
      {
        message: "route was not found",
      },
    ];
    return { errors: formattedErrors };
  }
}
