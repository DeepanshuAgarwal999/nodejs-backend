import { Request, Response } from "express";
import { connection } from "../db/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const getAllCats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const offset: string = ((Number(page) - 1) * Number(limit)).toString();

    const [results] = await connection.execute(
      "SELECT * FROM cats LIMIT ? OFFSET ?",
      [limit.toString(), offset]
    );

    const [count]: any = await connection.execute(
      "SELECT count(*) as count from cats"
    );

    const totalPages = Math.ceil(count[0]?.count / +limit);

    res.status(200).json({
      data: results,
      pagination: {
        page: +page,
        limit: +limit,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Error fetching cats:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
export const getCatById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const [results] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM `cats` WHERE `id` = ?",
      [id]
    );
    console.log(results.length === 0);
    if (!results || results.length === 0) {
      res.status(404).json({ message: "Cat not found" });
      return;
    }

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error fetching cats:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
export const createCat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age, breed } = req.body;

    if (!name || !age || !breed) {
      res.status(400).json({ message: "Please provide name, age, and breed" });
      return;
    }
    if (!connection) {
      res.status(500).json({ message: "Database connection failed" });
      return;
    }

    const [results] = await connection?.execute(
      "INSERT INTO `cats` (`name`, `age`, `breed`) VALUES (?, ?, ?)",
      [name, age, breed]
    );

    res.status(201).json({ data: results });
  } catch (error) {
    console.error("Error while adding cats:", error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

export const searchCatsByAge = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { age_lte, age_gte } = req.query;

  try {
    const [results] = await connection.execute(
      "SELECT * FROM `cats` WHERE `age` <= ? AND `age` >= ?",
      [age_lte, age_gte]
    );
    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error searching cats:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateCatById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, age, breed } = req.body;

  const fields: string[] = [];
  const values: any[] = [];

  if (name) {
    fields.push("`name` = ?");
    values.push(name);
  }
  if (age) {
    fields.push("`age` = ?");
    values.push(age);
  }
  if (breed) {
    fields.push("`breed` = ?");
    values.push(breed);
  }

  if (fields.length === 0) {
    res.status(400).json({ message: "No fields to update" });
    return;
  }

  values.push(id);

  const query = `UPDATE \`cats\` SET ${fields.join(", ")} WHERE \`id\` = ?`;

  try {
    const [result] = await connection.execute<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cat not found" });
      return;
    }

    res.status(200).json({ message: "Cat updated successfully" });
  } catch (err) {
    console.error("Error updating cat:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteCatById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "DELETE FROM `cats` WHERE `id` = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Cat not found" });
      return;
    }

    res.status(200).json({ message: "Cat deleted successfully" });
  } catch (err) {
    console.error("Error deleting cat:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
