import type { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler =
  (requestHandler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      next(err),
    );
  };

export default asyncHandler;
