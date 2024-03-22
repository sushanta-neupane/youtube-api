# Video Downloader API

This API allows users to search for videos and download them from YouTube.

## Test Domain

You can test this API using the following domain: `https://beattubeapi.vercel.app/`

## Endpoints

### Search Videos

- **Endpoint:** `/api?q=123&key=youtube-api-key`
- **Method:** GET
- **Description:** This endpoint allows users to search for videos on YouTube.
- **Query Parameters:**
  - `q`: The search query. Example: `q=funny+cats`
  - `key`: Your YouTube API key for authentication. Example: `key=your-youtube-api-key`
- **Response:** A JSON object containing the search results.

#### Example

```bash
curl -X GET 'https://beattubeapi.vercel.app/api?q=funny+cats&key=your-youtube-api-key'


```
### Download Video

- **Endpoint:** `/api/ytvideoID`
- **Method:** GET
- **Description:** This endpoint allows users to download a video by its YouTube video ID.
- **Path Parameter:**
  - `ytvideoID`: The ID of the YouTube video to download.
- **Response:** The video file to download.

