import type { NextFunction, Request, Response } from "express";
import CustomError from "../utils/CustomError.js";
import env from "../libs/env.js";

const devErrors = (res: Response, error: CustomError) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (res: Response, error: CustomError) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message:
        error.statusCode === 500
          ? "Our servers are lost in space. We'll bring them back soon!"
          : error.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: "Our servers are lost in space. We'll bring them back soon!",
    });
  }
};

const validationErrorHandler = (err: unknown) => {
  const errorObj = err as { errors: Record<string, { message: string }> };
  const errors = Object.values(errorObj.errors).map(
    (val: { message: string }) => val.message,
  );
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "ValidationError" || err.name === "CastError")
    err = validationErrorHandler(err);

  if (env.NODE_ENV === "development") {
    devErrors(res, err);
  } else if (env.NODE_ENV === "production") {
    prodErrors(res, err);
  }
};

export { errorHandler };
