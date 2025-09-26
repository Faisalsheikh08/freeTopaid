
# 🎓 YouTube Learning Platform

A comprehensive learning platform that transforms YouTube videos into interactive educational experiences with AI-powered content generation.

## ✨ Features

- **AI-Powered Quiz Generation**: Automatically creates quiz questions based on video transcripts
- **Smart Assignment Creation**: Generates practical assignments with clear instructions
- **Comprehensive Documentation**: Creates detailed documentation with key concepts and resources
- **Interactive Notes**: Enhanced note-taking with local storage
- **Video Transcript Integration**: Fetches and uses video transcripts for content generation
- **Progress Tracking**: Track your learning progress across videos and assignments

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables

Run the setup script to configure your environment variables:

```bash
npm run setup
# or
yarn setup
# or
pnpm setup
```

Or manually create a `.env.local` file with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Get Your API Keys

NEXT_PUBLIC_YOUTUBE_API_KEY=
GROQ_API_KEY=
MONGO_URI=
CLERK_API_KEY=
YOUTUBE_API_KEY=
GEMINI_API_KEY=

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 How It Works

1. **Add YouTube Videos**: Input YouTube video URLs or video IDs
2. **Generate Transcripts**: The platform automatically fetches video transcripts
3. **AI Content Generation**: Use AI to generate quizzes, assignments, and documentation
4. **Interactive Learning**: Take quizzes, complete assignments, and take notes
5. **Progress Tracking**: Monitor your learning progress

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Video Processing**: YouTube Transcript API
- **Database**: MongoDB (via Mongoose)

## 📖 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [API Documentation](docs/api.md) - API endpoints and usage
- [Component Guide](docs/components.md) - Component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Setup Guide](SETUP.md)
2. Review the troubleshooting section
3. Open an issue on GitHub
4. Check the console for error messages

## 🎯 Roadmap

- [ ] User authentication and profiles
- [ ] Course creation and management
- [ ] Social learning features
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Integration with learning management systems
