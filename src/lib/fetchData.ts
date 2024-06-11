import axios from "axios";
import { NextFunction, Request, Response } from "express";
import ytdl from "ytdl-core";
import * as yt from 'youtube-search-without-api-key';
import { Shazam } from "node-shazam";

const shazam = new Shazam();

const fetchData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, q , suggest } = req.query;

    if (!q) {
      res.status(400).json({ error: "Missing query parameter." });
      return next();
    }

    let responseData: any = {};

    switch (type) {
      case 'shazam':
        const musicData = await shazam.search_music("en-US", "GB", q as string, "10", "0");
        responseData.musicData = musicData;
        break;

      case 'yt':
        const videos = await yt.search(q as string);
        responseData.searchVideos = videos;
        break;
      case 'artists':
        // const artistData = await axios.get(`https://api.deezer.com/search/artist?q=${artist}`);
        const artistData2 = await shazam.search_artist("en-US","GB",q as string , "10","0")
        responseData.artists = artistData2
        break;

      default:
        res.status(400).json({ error: "Invalid type parameter." });
        return next();
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
    next(error); // Pass error to Express error handler
  }
};

export default fetchData;