import express from "express";
import {
  getSectionStories,
  getAllTopStories,
} from "../controllers/storiesControllers";

const router = express.Router();

router.get("/stories/:section", getSectionStories);
router.get("/allStories", getAllTopStories);

export default router;
