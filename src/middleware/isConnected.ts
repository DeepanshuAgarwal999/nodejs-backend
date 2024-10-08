import { Request, Response, NextFunction } from "express";
import { connection } from "../db/db";

const isConnected = (req: Request, res: Response, next: NextFunction) => {
  if (!connection) {
    res.status(500).json({ message: "Database connection failed" });
    return;
  } else {
    next();
  }
};

export default isConnected;
