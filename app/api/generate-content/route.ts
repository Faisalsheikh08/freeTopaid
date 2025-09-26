// // app/api/generate-content/route.ts
// import { NextRequest, NextResponse } from 'next/server';

// interface TranscriptItem {
//   text: string;
//   duration: number;
//   offset: number;
// }

// interface GenerateContentRequest {
//   videoId: string;
//   videoTitle: string;
//   transcript: TranscriptItem[];
//   contentType: 'quiz' | 'assignment' | 'documentation';
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { videoId, videoTitle, transcript, contentType }: GenerateContentRequest = await request.json();

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json({
//         error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.',
//         success: false
//       }, { status: 500 });
//     }

//     // Combine transcript text safely and truncate to 2000 chars to avoid token limit
//     const transcriptText = transcript.map(item => item.text).join(' ').substring(0, 2000);

//     let prompt = '';

//     switch (contentType) {
//       case 'quiz':
//         prompt = `You are an educational content generator. Respond ONLY with JSON. 
// Create a quiz based on the following video transcript titled "${videoTitle}". 
// The quiz should have 5-7 multiple choice questions, each with 4 options and an explanation for the correct answer. 
// Format exactly as JSON:

// {
//   "questions": [
//     {
//       "id": 1,
//       "question": "Question text",
//       "options": ["Option A", "Option B", "Option C", "Option D"],
//       "correctAnswer": 0,
//       "explanation": "Explanation for correct answer"
//     }
//   ]
// }

// Transcript: ${transcriptText}`;
//         break;

//       case 'assignment':
//         prompt = `You are an educational content generator. Respond ONLY with JSON.
// Create a practical assignment based on the video transcript "${videoTitle}". Include title, description, step-by-step instructions, deliverables, evaluation criteria, and estimated time. Format exactly as JSON:

// {
//   "title": "Assignment title",
//   "description": "Assignment description",
//   "instructions": ["Step 1", "Step 2"],
//   "deliverables": ["Deliverable 1"],
//   "evaluationCriteria": ["Criteria 1"],
//   "estimatedTime": "2-3 hours"
// }

// Transcript: ${transcriptText}`;
//         break;

//       case 'documentation':
//         prompt = `You are an educational content generator. Respond ONLY with JSON.
// Create documentation based on the video transcript "${videoTitle}". Include key points, concepts, resources, and a summary. Format exactly as JSON:

// {
//   "keyPoints": ["Point 1", "Point 2"],
//   "concepts": [{"name": "Concept name", "description": "Concept description"}],
//   "resources": [{"title": "Resource", "type": "article|tutorial", "description": "Description"}],
//   "summary": "Video summary"
// }

// Transcript: ${transcriptText}`;
//         break;
//     }

//     // Send request to Gemini API
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ input: { text: prompt } })
//       }
//     );

//     if (!response.ok) throw new Error('Failed to generate content with Gemini API');

//     const data = await response.json();
//     const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!generatedText) throw new Error('No content generated');

//     // Robust JSON parsing
//     const start = generatedText.indexOf('{');
//     const end = generatedText.lastIndexOf('}');
//     if (start === -1 || end === -1) throw new Error('Invalid JSON format in generated content');

//     const generatedContent = JSON.parse(generatedText.substring(start, end + 1));

//     return NextResponse.json({
//       success: true,
//       content: generatedContent,
//       contentType
//     });

//   } catch (error) {
//     console.error('Error generating content:', error);
//     return NextResponse.json({
//       error: error instanceof Error ? error.message : 'Failed to generate content',
//       success: false
//     }, { status: 500 });
//   }
// }

// app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
const modelId = 'gemini-1';

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

interface GenerateContentRequest {
  videoId: string;
  videoTitle: string;
  transcript: TranscriptItem[];
  contentType: 'quiz' | 'assignment' | 'documentation';
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, videoTitle, transcript, contentType }: GenerateContentRequest = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.',
        success: false
      }, { status: 500 });
    }

    // Combine transcript and truncate to avoid token limits
    const transcriptText = transcript.map(item => item.text).join(' ').substring(0, 2000);

    let prompt = '';

    switch (contentType) {
      case 'quiz':
        prompt = `You are an educational content generator. Respond ONLY with JSON. 
Create a quiz based on the video transcript titled "${videoTitle}". 
Include 5-7 multiple choice questions with 4 options and explanations. Format as JSON.

Transcript: ${transcriptText}`;
        break;

      case 'assignment':
        prompt = `You are an educational content generator. Respond ONLY with JSON. 
Create a practical assignment based on the video transcript titled "${videoTitle}". 
Include title, description, instructions, deliverables, evaluation criteria, estimated time. Format as JSON.

Transcript: ${transcriptText}`;
        break;

      case 'documentation':
        prompt = `You are an educational content generator. Respond ONLY with JSON. 
Create documentation based on the video transcript titled "${videoTitle}". 
Include key points, concepts, resources, and summary. Format as JSON.

Transcript: ${transcriptText}`;
        break;
    }

    // Correct payload for Gemini generateContent
    // const response = await fetch(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       contents: [
    //         {
    //           parts: [
    //             { text: prompt }
    //           ]
    //         }
    //       ]
    //     })
    //   }
    // );

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  }
);



    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      throw new Error(`Failed to generate content with Gemini API: ${errText}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) throw new Error('No content generated by Gemini API');

    // Robust JSON parsing
    const start = generatedText.indexOf('{');
    const end = generatedText.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Invalid JSON format in generated content');

    const generatedContent = JSON.parse(generatedText.substring(start, end + 1));

    return NextResponse.json({
      success: true,
      content: generatedContent,
      contentType
    });

  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to generate content',
      success: false
    }, { status: 500 });
  }
}
