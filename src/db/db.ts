import mysql, { Connection } from "mysql2/promise";
import handleError from "../utils/error";

export let connection: Connection | null = null;
export const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "cat",
      port: 3306,
      password: "admin",
    });
    if (connection) console.log("database connected!!");
   
  } catch (err) {
    handleError(err);
  }
};
