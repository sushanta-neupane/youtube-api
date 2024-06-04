import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const getShazamData = async (endpoint: string, params: object, res: Response) => {
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
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const musicData = async (req: Request, res: Response, next: NextFunction) => {
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

  const data = await getShazamData(endpoint, params, res);
  if (data) {
    res.status(200).json(data);
  }
};

export default musicData;
