/**  A custom error class that extends the Error class and adds a statusCode property to it :)
    This will be used to throw errors with a status code.
    @param message - The error message
    @param statusCode - The status code to be sent with the error
    @returns - An instance of the CustomError class
    
*/

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
