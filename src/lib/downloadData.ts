import { NextFunction, Request, Response } from "express";
import ytdl, { getInfo } from "ytdl-core";
import fs from "fs";
import path from "path";

const downloadData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract query parameters
    const { link } = req.query;

    // Validate required parameters
    if (!link) {
      res.status(400).json({ error: "Missing query parameter." });
      return next();
    }

    // Get the video info using ytdl-core
    const info = await ytdl.getInfo(link.toString());

    // Find the audio format with the highest bitrate
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

    // Set response headers for download
    res.setHeader("Content-Disposition", `attachment; filename="${info.videoDetails.title}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    // Download the audio stream and pipe it to the response
    ytdl(link.toString(), { format: audioFormat })
      .pipe(res);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error); // Pass error to Express error handler
  }
};

export default downloadData;
