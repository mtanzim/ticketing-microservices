import { ErrorResponse } from "../middleware/error-handler";

export interface FormattedError {
  serializeError(): ErrorResponse;
}
