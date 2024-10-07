import express from "express";
import {
  createCat,
  deleteCatById,
  getAllCats,
  getCatById,
  updateCatById,
} from "../controllers/cat";
import isAuthorized from "../middleware/isAuthorized";
import { CatDto } from "../dtos/Cat.dto";

const router = express.Router();

router.get("/", getAllCats);
router.get("/:id", getCatById);
router.post("/create", isAuthorized, createCat as any);
router.put("/update-cat/:id", isAuthorized, updateCatById as any);
router.delete("/delete-cat/:id", isAuthorized as any, deleteCatById as any);

export default router;
