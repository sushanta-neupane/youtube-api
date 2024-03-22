import axios from "axios";
import { NextFunction, Request, Response } from "express";
import ytdl from "ytdl-core";

const fetchData = async (req:Request, res:Response, next:NextFunction) => {
  try {
    // Extract query parameters
    const { key, q } = req.query;

    // Validate required parameters
    if (!key || !q) {
      res.status(400).json({ error: "Missing required parameters." });
      return next();
    }

    // Set API request URL for YouTube search
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      q as string
    )}&key=${key}&type=audio`;

    // Fetch data from YouTube API
    const { data } = await axios.get(apiUrl);

    // Get video info using ytdl-core
    const videoId = data?.items[0]?.id?.videoId;
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
