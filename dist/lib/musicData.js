var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
const getShazamData = (endpoint, params, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: 'GET',
        url: `https://shazam.p.rapidapi.com/${endpoint}`,
        params,
        headers: {
            'X-RapidAPI-Key': process.env.SHAZAM_API_KEY,
            'X-RapidAPI-Host': process.env.SHAZAM_HOST
        }
    };
    try {
        const response = yield axios.request(options);
        return response.data;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});
const musicData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, query } = req.query;
    let endpoint = '';
    let params = {};
    switch (type) {
        case 'search':
            endpoint = 'search';
            params = { term: query, locale: 'en-US', offset: '0', limit: '5' };
            break;
        case 'top-songs':
            endpoint = 'artists/get-top-songs';
            params = { id: query, l: 'en-US' };
            break;
        case 'latest-release':
            endpoint = 'artists/get-latest-release';
            params = { id: query, l: 'en-US' };
            break;
        case 'details':
            endpoint = 'artists/get-details';
            params = { id: query, l: 'en-US' };
            break;
        case 'related-artist':
            endpoint = 'songs/get-related-artist';
            params = { id: query, l: 'en-US' };
            break;
        default:
            res.status(400).json({ error: "Invalid type parameter." });
            return next();
    }
    const data = yield getShazamData(endpoint, params, res);
    if (data) {
        res.status(200).json(data);
    }
});
export default musicData;
