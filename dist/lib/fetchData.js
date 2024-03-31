var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ytdl from "ytdl-core";
import * as yt from 'youtube-search-without-api-key';
/**
 * Given a search query, searching on youtube
 * @param {string} search value (string or videoId).
 */
const fetchData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Extract query parameters
        const { key, q } = req.query;
        // Validate required parameters
        if (!q) {
            res.status(400).json({ error: "Missing query parameter." });
            return next();
        }
        const videos = yield yt.search(q);
        const videoId = (_b = (_a = videos[0]) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.videoId;
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
