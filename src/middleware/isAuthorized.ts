import { Request, Response, NextFunction } from "express";
const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({
        message: "Invalid request",
        success: false,
      });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token required",
        success: false,
      });
    }
    const isMatched = token === process.env.token;
    // const decoded = jwt.verify(token, process.env.SECRET_  KEY);

    if (!isMatched) {
      return res.status(401).json({
        message: "Invalid token",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log("Error in middleware", err);
    return res.status(401).json({
      message: "Token expired",
      success: false,
    });
  }
};
export default isAuthorized;
