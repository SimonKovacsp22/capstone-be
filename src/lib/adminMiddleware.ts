import createHttpError from "http-errors";
import { RequestHandler } from "express";
import { IUserRequest } from "./JWTMiddleware";

export const adminMiddleware:RequestHandler = (req: IUserRequest, res, next) => {
  if (req.user?.role !== "admin") {
    next(createHttpError(403, "Unauthorized access. Host only."));
  }
    next();
};
