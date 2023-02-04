import { ErrorResponse } from "../middleware/error-handler";
import { FormattedError } from "./interface";

export class DatabaseConnectionError extends Error implements FormattedError {
  reason = "Error connecting to database";
  constructor() {
    super();
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
