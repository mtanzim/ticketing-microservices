import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export async function currentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session?.jwt) {
    return next();
  }
  const secret = process.env?.["JWT_KEY"];
  try {
    const payload = jwt.verify(req.session.jwt, secret!) as UserPayload;
    req.currentUser = payload;
  } catch (err: any) {}
  next();
}
