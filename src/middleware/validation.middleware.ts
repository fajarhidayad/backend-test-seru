import type { NextFunction, Request, Response } from 'express';
import { ZodError, type z } from 'zod';

export function validateBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));

        return res.status(400).json({
          message: 'Invalid data',
          details: messages,
        });
      } else {
        return res.status(500).json({
          message: 'Internal Server Error',
        });
      }
    }
  };
}
