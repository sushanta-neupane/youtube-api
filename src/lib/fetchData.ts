import axios from "axios";
import { NextFunction, Request, Response } from "express";
import ytdl from "ytdl-core";

import * as yt from 'youtube-search-without-api-key';
/**
 * Given a search query, searching on youtube
 * @param {string} search value (string or videoId).
 */


const fetchData = async (req:Request, res:Response, next:NextFunction) => {
  try {
    // Extract query parameters
    const { key, q } = req.query;

    // Validate required parameters
    if (!q) {
      res.status(400).json({ error: "Missing query parameter." });
      return next();
    }

    const videos = await yt.search(q as string);

    const videoId = videos[0]?.id?.videoId;
    if (!videoId) {
      throw new Error("Video ID not found in API response.");
    }

    const videoInfo = await ytdl.getInfo(videoId);
    const relatedVideos = videoInfo.related_videos;

    // Extract relevant video details
    const videoDetails = {
      title: videoInfo.videoDetails.title,
      id: videoInfo.videoDetails.videoId,
      publishDate: videoInfo.videoDetails.publishDate,
      thumbnails: videoInfo.videoDetails.thumbnails,
      viewCount: videoInfo.videoDetails.viewCount,
    };

    // Respond with video info
    res.status(200).json({ videoDetails, relatedVideos });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error); // Pass error to Express error handler
  }
};

export default fetchData;
