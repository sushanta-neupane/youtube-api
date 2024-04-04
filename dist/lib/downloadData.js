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
const downloadData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters
        const { link } = req.query;
        // Validate required parameters
        if (!link) {
            res.status(400).json({ error: "Missing query parameter." });
            return next();
        }
        // Get the video info using ytdl-core
        const info = yield ytdl.getInfo(link.toString());
        // Find the audio format with the highest bitrate
        const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
        // Set response headers for download
        res.setHeader("Content-Disposition", `attachment; filename="${info.videoDetails.title}.mp3"`);
        res.setHeader("Content-Type", "audio/mpeg");
        // Download the audio stream and pipe it to the response
        ytdl(link.toString(), { format: audioFormat })
            .pipe(res);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error." });
        next(error); // Pass error to Express error handler
    }
});
export default downloadData;
