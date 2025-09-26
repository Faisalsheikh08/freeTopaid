# YouTube Learning Platform Setup

## Environment Variables Setup

To enable AI-powered content generation (quiz, assignment, documentation), you need to set up the following environment variables:

### 1. Create Environment File

Create a `.env.local` file in the root directory of your project:

```bash
# Required for AI content generation
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - for YouTube API features
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here

# Optional - for Groq API features  
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Replace `your_gemini_api_key_here` with your actual API key

### 3. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Features

Once properly configured, the following AI-powered features will be available:

- **AI Quiz Generation**: Automatically generates quiz questions based on video transcripts
- **AI Assignment Creation**: Creates practical assignments with instructions and evaluation criteria
- **AI Documentation**: Generates comprehensive documentation with key concepts and resources
- **Smart Notes**: Enhanced note-taking with local storage

## Troubleshooting

### "Gemini API key not configured" Error

If you see this error when trying to generate content:

1. Make sure you've created the `.env.local` file
2. Verify the `GEMINI_API_KEY` is correctly set
3. Restart your development server
4. Check that the API key is valid and has proper permissions

### Transcript Generation Issues

If transcript generation fails:

1. Ensure the video has captions/transcripts available
2. Check your internet connection
3. Verify the video ID is correct
4. Some videos may not have transcripts available

## API Usage

The platform uses the following APIs:

- **Gemini API**: For AI content generation (quiz, assignment, documentation)
- **YouTube Transcript API**: For fetching video transcripts
- **YouTube Data API**: For video metadata (optional)

Make sure to monitor your API usage to avoid exceeding quotas.
