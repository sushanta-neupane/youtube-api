import express from "express";
const router = express.Router();
import fetchData from "../lib/fetchData.js";
import { fetchMusicById, fetchMusicByQuery } from "../lib/fetchIndividualData.js";
import downloadData from "../lib/downloadData.js";
// Combine all route handlers
router.get("/", fetchData);
router.get("/download", downloadData);
router.get("/music/:id", fetchMusicById);
router.get("/music", fetchMusicByQuery);
export default router;
