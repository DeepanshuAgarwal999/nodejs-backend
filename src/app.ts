import express, { Request, Response } from "express";
import { connectDB } from "./db/db";
import morgan from "morgan";
import catRouter from "./routes/cat.route";
import "dotenv/config";
import isConnected from "./middleware/isConnected";

const PORT = 4000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "helloworld",
  });
});

app.use("/api", isConnected, catRouter);

connectDB();
app.listen(PORT, () => {
  console.info("Server running on port: " + PORT);
});
