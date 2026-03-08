import { Request, Response, NextFunction } from "express";

/**
 * Mock auth: set authorId from header (e.g. X-Author-Id) or default.
 * In production you'd validate a JWT/session and set req.user.
 */
declare global {
  namespace Express {
    interface Request {
      authorId?: string;
    }
  }
}

export function mockAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.authorId = req.headers["x-author-id"] as string;
  next();
}
