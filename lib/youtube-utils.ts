// File: lib/youtube-utils.ts
// Utility functions for YouTube API operations

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  publishedAt: string;
}

interface YouTubePlaylistResponse {
  videos: YouTubeVideo[];
  totalResults: number;
}

/**
 * Fetch all videos from a YouTube playlist (handles pagination)
 * @param playlistId - The YouTube playlist ID
 * @param apiKey - Your YouTube Data API key
 * @returns Promise with all videos in the playlist
 */
export async function fetchAllPlaylistVideos(
  playlistId: string, 
  apiKey: string
): Promise<YouTubePlaylistResponse> {
  const videos: YouTubeVideo[] = [];
  let nextPageToken = '';
  let totalResults = 0;

  try {
    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
      url.searchParams.set('part', 'snippet,contentDetails');
      url.searchParams.set('playlistId', playlistId);
      url.searchParams.set('maxResults', '50'); // Maximum allowed by YouTube API
      url.searchParams.set('key', apiKey);
      
      if (nextPageToken) {
        url.searchParams.set('pageToken', nextPageToken);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`YouTube API error: ${data.error.message}`);
      }

      totalResults = data.pageInfo.totalResults;

      // Process each video in the current page
      for (const item of data.items) {
        // Skip private/deleted videos
        if (!item.snippet || item.snippet.title === 'Private video' || item.snippet.title === 'Deleted video') {
          continue;
        }

        const videoId = item.snippet.resourceId.videoId;
        
        // Get video duration using videos endpoint
        const videoDetails = await fetchVideoDetails(videoId, apiKey);
        
        videos.push({
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description || '',
          duration: videoDetails.duration,
          thumbnailUrl: item.snippet.thumbnails?.medium?.url || 
                       item.snippet.thumbnails?.default?.url || '',
          publishedAt: item.snippet.publishedAt
        });
      }

      nextPageToken = data.nextPageToken || '';
      
    } while (nextPageToken);

    return {
      videos,
      totalResults
    };

  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
}

/**
 * Fetch video details including duration
 * @param videoId - YouTube video ID
 * @param apiKey - YouTube Data API key
 * @returns Video details with formatted duration
 */
async function fetchVideoDetails(videoId: string, apiKey: string) {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'contentDetails');
  url.searchParams.set('id', videoId);
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const duration = data.items[0].contentDetails.duration;
    return {
      duration: formatDuration(duration)
    };
  }

  return { duration: '0:00' };
}

/**
 * Convert YouTube duration format (PT4M13S) to readable format (4:13)
 * @param duration - YouTube duration in ISO 8601 format
 * @returns Formatted duration string
 */
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Extract playlist ID from YouTube URL
 * @param url - YouTube playlist URL
 * @returns Playlist ID or null if not found
 */
export function extractPlaylistId(url: string): string | null {
  const regex = /[?&]list=([^#\&\?]*)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Validate YouTube API key
 * @param apiKey - YouTube Data API key
 * @returns Promise<boolean> - True if valid
 */
export async function validateYouTubeApiKey(apiKey: string): Promise<boolean> {
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', 'test');
    url.searchParams.set('maxResults', '1');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    return response.ok;
  } catch {
    return false;
  }
}