// // import { NextRequest, NextResponse } from 'next/server';
// // import { YoutubeTranscript } from 'youtube-transcript-plus';

// // export async function POST(request: NextRequest) {
// //   try {
// //     const { videoId } = await request.json();

// //     if (!videoId) {
// //       return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
// //     }

// //     // Fetch transcript using youtube-transcript-plus
// //     const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
// //       lang: 'en', // Default to English, you can make this configurable
// //       country: 'US' // Default country
// //     });

// //     // Transform the transcript data to match your interface
// //     const formattedTranscript = transcript.map(item => ({
// //       text: item.text,
// //       duration: item.duration,
// //       offset: item.offset
// //     }));

// //     return NextResponse.json({ 
// //       success: true, 
// //       transcript: formattedTranscript 
// //     });
// //   } catch (error) {
// //     console.error('Error fetching transcript:', error);
    
// //     let errorMessage = 'Failed to fetch transcript';
    
// //     if (error instanceof Error) {
// //       // Handle specific error types
// //       if (error.message.includes('Transcript is disabled')) {
// //         errorMessage = 'Transcript is disabled for this video';
// //       } else if (error.message.includes('No transcript found')) {
// //         errorMessage = 'No transcript available for this video';
// //       } else if (error.message.includes('Video unavailable')) {
// //         errorMessage = 'Video is unavailable or private';
// //       } else if (error.message.includes('Could not retrieve a transcript')) {
// //         errorMessage = 'Transcript not available for this video';
// //       } else if (error.message.includes('Transcript not found')) {
// //         errorMessage = 'No transcript found for this video';
// //       } else {
// //         errorMessage = error.message;
// //       }
// //     }

// //     return NextResponse.json({ 
// //       error: errorMessage,
// //       success: false 
// //     }, { status: 500 });
// //   }
// // }


// // app/api/get-transcript/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { YoutubeTranscript } from 'youtube-transcript-plus';

// export async function POST(request: NextRequest) {
//   try {
//     const { videoId, lang = 'en', country = 'US' } = await request.json();

//     // Validate videoId
//     if (!videoId || typeof videoId !== 'string') {
//       return NextResponse.json(
//         { success: false, error: 'Video ID is required and must be a string' },
//         { status: 400 }
//       );
//     }

//     console.log(`Fetching transcript for videoId: ${videoId}`);

//     let transcript;
//     try {
//       // Fetch transcript from youtube-transcript-plus
//       transcript = await YoutubeTranscript.fetchTranscript(videoId, {
//         lang,
//         country
//       });
//     } catch (fetchError) {
//       console.error('Transcript fetch error:', fetchError);
//       return NextResponse.json(
//         { success: false, error: 'Transcript not available for this video' },
//         { status: 404 }
//       );
//     }

//     // If transcript is empty
//     if (!transcript || transcript.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No transcript found for this video' },
//         { status: 404 }
//       );
//     }

//     // Format transcript
//     const formattedTranscript = transcript.map(item => ({
//       text: item.text,
//       duration: item.duration,
//       offset: item.offset
//     }));

//     return NextResponse.json({
//       success: true,
//       transcript: formattedTranscript
//     });

//   } catch (error) {
//     console.error('Unexpected error:', error);

//     let errorMessage = 'Failed to fetch transcript';

//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }

//     return NextResponse.json(
//       { success: false, error: errorMessage },
//       { status: 500 }
//     );
//   }
// }


// app/api/get-transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript-plus';

export async function POST(request: NextRequest) {
  try {
    const { videoId, lang = 'en', country = 'US' } = await request.json();

    // Validate videoId
    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Video ID is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`Fetching transcript for videoId: ${videoId}`);

    let transcript;
    try {
      // Fetch transcript from youtube-transcript-plus
      transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang,
        country
      });
    } catch (fetchError) {
      console.error('Transcript fetch error:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Transcript not available for this video' },
        { status: 404 }
      );
    }

    // If transcript is empty
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No transcript found for this video' },
        { status: 404 }
      );
    }

    // Format transcript
    const formattedTranscript = transcript.map(item => ({
      text: item.text,
      duration: item.duration,
      offset: item.offset
    }));

    return NextResponse.json({
      success: true,
      transcript: formattedTranscript
    });

  } catch (error) {
    console.error('Unexpected error:', error);

    let errorMessage = 'Failed to fetch transcript';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}


