// File: pages/api/get-playlist.ts (for Pages Router)
// OR
// File: app/api/get-playlist/route.ts (for App Router)

import { NextApiRequest, NextApiResponse } from "next";
import {
  fetchAllPlaylistVideos,
  extractPlaylistId,
} from "../../lib/youtube-utils";

// For Pages Router (pages/api/get-playlist.ts)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { playlistUrl, playlistId } = req.body;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "YouTube API key not configured. Please add YOUTUBE_API_KEY to your environment variables.",
    });
  }

  let finalPlaylistId = playlistId;

  // Extract playlist ID from URL if provided
  if (playlistUrl && !playlistId) {
    finalPlaylistId = extractPlaylistId(playlistUrl);
    if (!finalPlaylistId) {
      return res.status(400).json({
        error:
          "Invalid YouTube playlist URL. Please provide a valid playlist URL.",
      });
    }
  }

  if (!finalPlaylistId) {
    return res.status(400).json({
      error: "Playlist ID or URL is required",
    });
  }

  try {
    console.log(`Fetching playlist: ${finalPlaylistId}`);

    const playlistData = await fetchAllPlaylistVideos(finalPlaylistId, apiKey);

    // Transform data to match your component's interface
    const formattedVideos = playlistData.videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      completed: false, // Default to not completed
      thumbnailUrl: video.thumbnailUrl,
      progress: 0,
    }));

    console.log(
      `Successfully fetched ${formattedVideos.length} videos from playlist`
    );

    res.status(200).json({
      success: true,
      playlist: {
        videos: formattedVideos,
      },
      totalVideos: playlistData.totalResults,
      fetchedVideos: formattedVideos.length,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);

    let errorMessage = "Failed to fetch playlist";

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or expired YouTube API key";
      } else if (error.message.includes("playlistNotFound")) {
        errorMessage = "Playlist not found or is private";
      } else if (error.message.includes("quota")) {
        errorMessage = "YouTube API quota exceeded. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }

    res.status(500).json({
      error: errorMessage,
      success: false,
    });
  }
}

// Alternative: For App Router (app/api/get-playlist/route.ts)
/*
import { NextRequest, NextResponse } from 'next/server';
import { fetchAllPlaylistVideos, extractPlaylistId } from '../../../lib/youtube-utils';

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl, playlistId } = await request.json();
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'YouTube API key not configured. Please add YOUTUBE_API_KEY to your environment variables.'
      }, { status: 500 });
    }

    let finalPlaylistId = playlistId;

    if (playlistUrl && !playlistId) {
      finalPlaylistId = extractPlaylistId(playlistUrl);
      if (!finalPlaylistId) {
        return NextResponse.json({
          error: 'Invalid YouTube playlist URL. Please provide a valid playlist URL.'
        }, { status: 400 });
      }
    }

    if (!finalPlaylistId) {
      return NextResponse.json({
        error: 'Playlist ID or URL is required'
      }, { status: 400 });
    }

    console.log(`Fetching playlist: ${finalPlaylistId}`);
    
    const playlistData = await fetchAllPlaylistVideos(finalPlaylistId, apiKey);
    
    const formattedVideos = playlistData.videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      duration: video.duration,
      completed: false,
      thumbnailUrl: video.thumbnailUrl,
      progress: 0
    }));

    console.log(`Successfully fetched ${formattedVideos.length} videos from playlist`);

    return NextResponse.json({
      success: true,
      playlist: {
        videos: formattedVideos
      },
      totalVideos: playlistData.totalResults,
      fetchedVideos: formattedVideos.length
    });

  } catch (error) {
    console.error('Error fetching playlist:', error);
    
    let errorMessage = 'Failed to fetch playlist';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid or expired YouTube API key';
      } else if (error.message.includes('playlistNotFound')) {
        errorMessage = 'Playlist not found or is private';
      } else if (error.message.includes('quota')) {
        errorMessage = 'YouTube API quota exceeded. Please try again later.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({
      error: errorMessage,
      success: false
    }, { status: 500 });
  }
}
*/
