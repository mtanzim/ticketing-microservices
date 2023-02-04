export class DatabaseConnectionError extends Error {
  reasons = "Error connecting to database";
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
