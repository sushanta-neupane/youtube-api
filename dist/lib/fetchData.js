var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import ytdl from "ytdl-core";
const fetchData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Extract query parameters
        const { key, q } = req.query;
        // Validate required parameters
        if (!key || !q) {
            res.status(400).json({ error: "Missing required parameters." });
            return next();
        }
        // Set API request URL for YouTube search
        const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(q)}&key=${key}&type=audio`;
        // Fetch data from YouTube API
        const { data } = yield axios.get(apiUrl);
        // Get video info using ytdl-core
        const videoId = (_b = (_a = data === null || data === void 0 ? void 0 : data.items[0]) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.videoId;
        if (!videoId) {
            throw new Error("Video ID not found in API response.");
        }
        const videoInfo = yield ytdl.getInfo(videoId);
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
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error." });
        next(error); // Pass error to Express error handler
    }
});
export default fetchData;
