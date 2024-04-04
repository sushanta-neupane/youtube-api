import { NextFunction, Request, Response } from "express";
import ytdl from "ytdl-core";

const fetchIndividualData = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id ,type } = req.params;

    const videoInfo = await ytdl.getInfo(id);

    const formatVideoHigh = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highestvideo",
    }).url;
    const formatAudioHigh = ytdl.chooseFormat(videoInfo.formats, {
      quality: "highestaudio",
    }).url;
    const formatVideoLow = ytdl.chooseFormat(videoInfo.formats, {
      quality: "lowestvideo",
    }).url;
    const formatAudioLow = ytdl.chooseFormat(videoInfo.formats, {
      quality: "lowestaudio",
    }).url;
    const formatAudioAndVideo = ytdl.filterFormats(
      videoInfo.formats,
      "audioandvideo"
    )[0].url;
    const relatedVideos = videoInfo.related_videos;

    // Extract relevant video details
    const videoDetails = {
      title: videoInfo.videoDetails.title,
      id: videoInfo.videoDetails.videoId,
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

    // Respond with video info
    res.status(200).json({ videoDetails, relatedVideos });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error); // Pass error to Express error handler
  }
};

export default fetchIndividualData;
