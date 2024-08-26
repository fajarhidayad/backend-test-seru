import type { NextFunction, Request, Response } from 'express';

export function errorNotFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    message: 'Route not found',
  });
}

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const code = req.statusCode as number;

  if (code < 500) {
    return res.status(code).json({
      message: err.message,
    });
  }

  return res.status(code).json({
    message: 'Internal server error',
  });
}
