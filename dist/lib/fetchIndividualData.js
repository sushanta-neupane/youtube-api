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
const fetchIndividualData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const videoInfo = yield ytdl.getInfo(id);
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
        const formatAudioAndVideo = ytdl.filterFormats(videoInfo.formats, "audioandvideo")[0].url;
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
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error." });
        next(error); // Pass error to Express error handler
    }
});
export default fetchIndividualData;
