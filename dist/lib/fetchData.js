var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as yt from 'youtube-search-without-api-key';
import { Shazam } from "node-shazam";
const shazam = new Shazam();
const fetchData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, q, suggest } = req.query;
        if (!q) {
            res.status(400).json({ error: "Missing query parameter." });
            return next();
        }
        let responseData = {};
        switch (type) {
            case 'shazam':
                const musicData = yield shazam.search_music("en-US", "GB", q, "10", "0");
                responseData.musicData = musicData;
                break;
            case 'yt':
                const videos = yield yt.search(q);
                responseData.searchVideos = videos;
                break;
            case 'artists':
                // const artistData = await axios.get(`https://api.deezer.com/search/artist?q=${artist}`);
                const artistData2 = yield shazam.search_artist("en-US", "GB", q, "10", "0");
                responseData.artists = artistData2;
                break;
            default:
                res.status(400).json({ error: "Invalid type parameter." });
                return next();
        }
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error." });
        next(error); // Pass error to Express error handler
    }
});
export default fetchData;
