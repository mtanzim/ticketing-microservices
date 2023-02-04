import { ErrorResponse } from "../middleware/error-handler";
import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = 400;

  constructor() {
    super("database connection error");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
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
