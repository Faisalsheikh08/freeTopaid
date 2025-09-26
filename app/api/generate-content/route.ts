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

//     // Combine transcript and truncate to avoid token limits
//     const transcriptText = transcript.map(item => item.text).join(' ').substring(0, 3000);

//     let prompt = '';

//     switch (contentType) {
//       case 'quiz':
//         prompt = `You are an educational content generator. Respond ONLY with valid JSON. 
// Create a quiz based on the video transcript titled "${videoTitle}". 
// Create 5-7 multiple choice questions with 4 options each and explanations for correct answers.

// Format exactly as JSON:
// {
//   "questions": [
//     {
//       "id": 1,
//       "question": "Question text here?",
//       "options": ["Option A", "Option B", "Option C", "Option D"],
//       "correctAnswer": 0,
//       "explanation": "Explanation for the correct answer"
//     }
//   ]
// }

// Transcript: ${transcriptText}`;
//         break;

//       case 'assignment':
//         prompt = `You are an educational content generator. Respond ONLY with valid JSON. 
// Create a practical assignment based on the video transcript titled "${videoTitle}". 

// Format exactly as JSON:
// {
//   "title": "Assignment title",
//   "description": "Brief assignment description",
//   "instructions": ["Step 1", "Step 2", "Step 3"],
//   "deliverables": ["Deliverable 1", "Deliverable 2"],
//   "evaluationCriteria": ["Criteria 1", "Criteria 2"],
//   "estimatedTime": "2-3 hours"
// }

// Transcript: ${transcriptText}`;
//         break;

//       case 'documentation':
//         prompt = `You are an educational content generator. Respond ONLY with valid JSON. 
// Create documentation based on the video transcript titled "${videoTitle}". 

// Format exactly as JSON:
// {
//   "keyPoints": ["Point 1", "Point 2", "Point 3"],
//   "concepts": [
//     {"name": "Concept name", "description": "Concept description"}
//   ],
//   "resources": [
//     {"title": "Resource title", "type": "article", "description": "Resource description"}
//   ],
//   "summary": "Brief summary of the video content"
// }

// Transcript: ${transcriptText}`;
//         break;
//     }

//     // Use correct Gemini model name
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 { text: prompt }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     if (!response.ok) {
//       const errText = await response.text();
//       console.error('Gemini API error:', errText);
//       throw new Error(`Gemini API returned ${response.status}: ${errText}`);
//     }

//     const data = await response.json();
    
//     if (!data.candidates || data.candidates.length === 0) {
//       throw new Error('No content generated by Gemini API');
//     }

//     const generatedText = data.candidates[0]?.content?.parts[0]?.text;

//     if (!generatedText) {
//       throw new Error('No text content in Gemini API response');
//     }

//     // Robust JSON parsing
//     let generatedContent;
//     try {
//       // Try to find JSON in the response
//       const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
//       if (!jsonMatch) {
//         throw new Error('No JSON found in response');
//       }
      
//       generatedContent = JSON.parse(jsonMatch[0]);
//     } catch (parseError) {
//       console.error('JSON parsing failed:', parseError);
//       console.error('Generated text:', generatedText);
      
//       // Fallback: create default content based on type
//       switch (contentType) {
//         case 'quiz':
//           generatedContent = {
//             questions: [
//               {
//                 id: 1,
//                 question: `What was the main topic discussed in "${videoTitle}"?`,
//                 options: ["Topic A", "Topic B", "Topic C", "Topic D"],
//                 correctAnswer: 0,
//                 explanation: "Based on the video content analysis."
//               }
//             ]
//           };
//           break;
//         case 'assignment':
//           generatedContent = {
//             title: `Assignment: ${videoTitle}`,
//             description: "Complete this assignment based on the video content.",
//             instructions: ["Watch the video carefully", "Take notes on key concepts", "Complete the exercises"],
//             deliverables: ["Written summary", "Practical implementation"],
//             evaluationCriteria: ["Understanding of concepts", "Quality of implementation"],
//             estimatedTime: "2-3 hours"
//           };
//           break;
//         case 'documentation':
//           generatedContent = {
//             keyPoints: ["Key concept 1", "Key concept 2", "Key concept 3"],
//             concepts: [
//               {"name": "Main Concept", "description": "Description of the main concept from the video"}
//             ],
//             resources: [
//               {"title": "Related Resource", "type": "article", "description": "Additional reading material"}
//             ],
//             summary: `Summary of ${videoTitle} content.`
//           };
//           break;
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       content: generatedContent,
//       contentType
//     });

//   } catch (error) {
//     console.error('Error generating content:', error);
    
//     let errorMessage = 'Failed to generate content';
//     if (error instanceof Error) {
//       if (error.message.includes('API key')) {
//         errorMessage = 'Invalid Gemini API key. Please check your API key configuration.';
//       } else if (error.message.includes('quota')) {
//         errorMessage = 'Gemini API quota exceeded. Please try again later.';
//       } else {
//         errorMessage = error.message;
//       }
//     }

//     return NextResponse.json({
//       error: errorMessage,
//       success: false
//     }, { status: 500 });
//   }
// }


// app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server';

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
    const transcriptText = transcript.map(item => item.text).join(' ').substring(0, 3000);

    let prompt = '';

    switch (contentType) {
      case 'quiz':
        prompt = `You are an educational content generator. Respond ONLY with valid JSON. 
Create a quiz based on the video transcript titled "${videoTitle}". 
Create 5-7 multiple choice questions with 4 options each and explanations for correct answers.

Format exactly as JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation for the correct answer"
    }
  ]
}

Transcript: ${transcriptText}`;
        break;

      case 'assignment':
        prompt = `You are an educational content generator. Respond ONLY with valid JSON. 
Create a practical assignment based on the video transcript titled "${videoTitle}". 

Format exactly as JSON:
{
  "title": "Assignment title",
  "description": "Brief assignment description",
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "evaluationCriteria": ["Criteria 1", "Criteria 2"],
  "estimatedTime": "2-3 hours"
}

Transcript: ${transcriptText}`;
        break;

      case 'documentation':
        prompt = `You are an educational content generator. Respond ONLY with valid JSON. 
Create documentation based on the video transcript titled "${videoTitle}". 

Format exactly as JSON:
{
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "concepts": [
    {"name": "Concept name", "description": "Concept description"}
  ],
  "resources": [
    {"title": "Resource title", "type": "article", "description": "Resource description"}
  ],
  "summary": "Brief summary of the video content"
}

Transcript: ${transcriptText}`;
        break;
    }

    // FIX: Change model from 'gemini-pro' to 'gemini-2.5-flash' for v1beta API endpoint
    // 'gemini-2.5-flash' is the current recommended general-purpose, fast model.
    const MODEL_NAME = 'gemini-2.5-flash';

    const response = await fetch(
      // Corrected URL: Use the updated model name in the URL
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
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
      // Removed the redundant API key check from the error message as it's not the root cause
      throw new Error(`Gemini API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No content generated by Gemini API');
    }

    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No text content in Gemini API response');
    }

    // Robust JSON parsing
    let generatedContent;
    try {
      // Try to find JSON in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      generatedContent = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Generated text:', generatedText);
      
      // Fallback: create default content based on type
      switch (contentType) {
        case 'quiz':
          generatedContent = {
            questions: [
              {
                id: 1,
                question: `What was the main topic discussed in "${videoTitle}"?`,
                options: ["Topic A", "Topic B", "Topic C", "Topic D"],
                correctAnswer: 0,
                explanation: "Based on the video content analysis."
              }
            ]
          };
          break;
        case 'assignment':
          generatedContent = {
            title: `Assignment: ${videoTitle}`,
            description: "Complete this assignment based on the video content.",
            instructions: ["Watch the video carefully", "Take notes on key concepts", "Complete the exercises"],
            deliverables: ["Written summary", "Practical implementation"],
            evaluationCriteria: ["Understanding of concepts", "Quality of implementation"],
            estimatedTime: "2-3 hours"
          };
          break;
        case 'documentation':
          generatedContent = {
            keyPoints: ["Key concept 1", "Key concept 2", "Key concept 3"],
            concepts: [
              {"name": "Main Concept", "description": "Description of the main concept from the video"}
            ],
            resources: [
              {"title": "Related Resource", "type": "article", "description": "Additional reading material"}
            ],
            summary: `Summary of ${videoTitle} content.`
          };
          break;
      }
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      contentType
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    let errorMessage = 'Failed to generate content';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid Gemini API key. Please check your API key configuration.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'Gemini API quota exceeded. Please try again later.';
      } else {
        // More specific error for the 404 model issue
        if (error.message.includes('404') && error.message.includes('models/gemini-pro')) {
            errorMessage = 'Model not found. Try updating to a supported model like gemini-2.5-flash.';
        } else {
            errorMessage = error.message;
        }
      }
    }

    return NextResponse.json({
      error: errorMessage,
      success: false
    }, { status: 500 });
  }
}