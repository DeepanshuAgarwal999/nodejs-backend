import express from "express";
import {
  createCat,
  deleteCatById,
  getAllCats,
  getCatById,
  updateCatById,
} from "../controllers/cat";
import isAuthorized from "../middleware/isAuthorized";

const router = express.Router();

router.get("/", getAllCats);
router.get("/:id", getCatById);
router.post("/create", isAuthorized, createCat);
router.put("/update-cat/:id", isAuthorized, updateCatById);
router.delete("/delete-cat/:id", isAuthorized, deleteCatById);

export default router;
