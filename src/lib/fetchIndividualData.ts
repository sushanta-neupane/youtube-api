import { NextFunction, Request, Response } from "express";
import ytdl from "ytdl-core";
import * as yt from 'youtube-search-without-api-key';

// Fetch video by ID
const fetchMusicById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Missing id parameter." });
      return next();
    }

    const videoInfo = await ytdl.getInfo(id);

    const formatVideoHigh = ytdl.chooseFormat(videoInfo.formats, { quality: "highestvideo" }).url;
    const formatAudioHigh = ytdl.chooseFormat(videoInfo.formats, { quality: "highestaudio" }).url;
    const formatVideoLow = ytdl.chooseFormat(videoInfo.formats, { quality: "lowestvideo" }).url;
    const formatAudioLow = ytdl.chooseFormat(videoInfo.formats, { quality: "lowestaudio" }).url;
    const formatAudioAndVideo = ytdl.filterFormats(videoInfo.formats, "audioandvideo")[0].url;
    const relatedVideos = videoInfo.related_videos;

    const videoDetails = {
      title: videoInfo.videoDetails.title,
      id: videoInfo.videoDetails.videoId,
      author: videoInfo.videoDetails.author,
      publishDate: videoInfo.videoDetails.publishDate,
      thumbnails: videoInfo.videoDetails.thumbnails,
      viewCount: videoInfo.videoDetails.viewCount,
      likeCount: videoInfo.videoDetails.likes,
      formatAudioHigh,
      formatAudioLow,
      formatVideoHigh,
      formatVideoLow,
      duration: videoInfo.videoDetails.lengthSeconds,
      formatAudioAndVideo,
    };

    res.status(200).json({ videoDetails, relatedVideos });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error); // Pass error to Express error handler
  }
};

// Fetch video by query
const fetchMusicByQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

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

    const formatVideoHigh = ytdl.chooseFormat(videoInfo.formats, { quality: "highestvideo" }).url;
    const formatAudioHigh = ytdl.chooseFormat(videoInfo.formats, { quality: "highestaudio" }).url;
    const formatVideoLow = ytdl.chooseFormat(videoInfo.formats, { quality: "lowestvideo" }).url;
    const formatAudioLow = ytdl.chooseFormat(videoInfo.formats, { quality: "lowestaudio" }).url;
    const formatAudioAndVideo = ytdl.filterFormats(videoInfo.formats, "audioandvideo")[0].url;
    const relatedVideos = videoInfo.related_videos;

    const videoDetails = {
      title: videoInfo.videoDetails.title,
      id: videoInfo.videoDetails.videoId,
      author: videoInfo.videoDetails.author,
      publishDate: videoInfo.videoDetails.publishDate,
      thumbnails: videoInfo.videoDetails.thumbnails,
      viewCount: videoInfo.videoDetails.viewCount,
      likeCount: videoInfo.videoDetails.likes,
      formatAudioHigh,
      formatAudioLow,
      formatVideoHigh,
      formatVideoLow,
      duration: videoInfo.videoDetails.lengthSeconds,
      formatAudioAndVideo,
    };

    res.status(200).json({ videoDetails, relatedVideos });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error); // Pass error to Express error handler
  }
};

export { fetchMusicById, fetchMusicByQuery };
