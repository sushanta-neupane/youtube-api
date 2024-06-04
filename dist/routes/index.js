import express from "express";
const router = express.Router();
import fetchData from "../lib/fetchData.js";
import fetchIndividualData from "../lib/fetchIndividualData.js";
import downloadData from "../lib/downloadData.js";
import musicData from "../lib/musicData.js";
// Combine all route handlers
router.get("/", fetchData);
router.get("/download", downloadData);
router.get("/music", musicData);
router.get("/:id", fetchIndividualData);
export default router;
