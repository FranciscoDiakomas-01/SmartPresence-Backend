import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

export default async function VerifyToken(req: Request,res: Response,next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1] as string;
    if (!token) {
      res.status(402).json({
        error: "token not provided",
      });
      return;
    }
    const verified = jsonwebtoken.verify(token , String(process.env.JWT)) as {id : number}
    req.body.userid = verified.id
    req.body.token = token
    next()
    return
  } catch (error) {
    res.status(402).json({
      error: "invalid token",
    });
    return;
  }
}
