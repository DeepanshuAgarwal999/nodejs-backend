import { Request, Response, NextFunction } from "express";
const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization ?? "";
    if (
      !authorization ||
      authorization === "" ||
      !authorization.startsWith("Bearer")
    ) {
      res.status(401).json({
        message: "Invalid request",
        success: false,
      });
      return;
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "Token required",
        success: false,
      });
      return;
    }
    const isMatched = token === process.env.token;
    // const decoded = jwt.verify(token, process.env.SECRET_  KEY);

    if (!isMatched) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    } else {
      next();
    }
  } catch (err) {
    console.log("Error in middleware", err);
    res.status(401).json({
      message: "Token expired",
      success: false,
    });
  }
};
export default isAuthorized;
