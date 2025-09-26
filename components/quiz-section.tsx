"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Award, Loader2, CheckCircle, XCircle } from "lucide-react"

interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

interface QuizSectionProps {
  videoId?: string;
  transcript?: TranscriptItem[];
  isLoading?: boolean;
  onFetchTranscript?: () => Promise<void>;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function QuizSection({ 
  videoId, 
  transcript, 
  isLoading = false,
  onFetchTranscript 
}: QuizSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Sample quiz questions - in a real app, these would be generated based on transcript
  const sampleQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Based on the video content, what is the main topic discussed?",
      options: [
        "Web Development",
        "Mobile App Development", 
        "Data Science",
        "Machine Learning"
      ],
      correctAnswer: 0,
      explanation: "The video focuses on web development concepts and practices."
    },
    {
      id: 2,
      question: "Which technology was mentioned as essential for modern development?",
      options: [
        "jQuery",
        "React",
        "Flash",
        "PHP"
      ],
      correctAnswer: 1,
      explanation: "React was highlighted as a key technology for modern web development."
    }
  ]

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      setQuizCompleted(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    sampleQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: sampleQuestions.length,
      percentage: Math.round((correct / sampleQuestions.length) * 100)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setQuizCompleted(false)
  }

  const handleToggleOpen = async () => {
    if (!isOpen && transcript === undefined && onFetchTranscript) {
      await onFetchTranscript()
    }
    setIsOpen(!isOpen)
  }

  const renderQuizContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-400">Loading transcript for quiz generation...</span>
        </div>
      )
    }

    if (!transcript || transcript.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-2">No transcript available for quiz generation</p>
          {onFetchTranscript && (
            <Button
              onClick={onFetchTranscript}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Try to Load Transcript
            </Button>
          )}
        </div>
      )
    }

    if (showResults) {
      const score = calculateScore()
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {score.percentage >= 70 ? (
                <span className="text-green-400">🎉 Congratulations!</span>
              ) : (
                <span className="text-yellow-400">📚 Keep Learning!</span>
              )}
            </div>
            <p className="text-lg">
              Your Score: {score.correct}/{score.total} ({score.percentage}%)
            </p>
          </div>

          <div className="space-y-3">
            {sampleQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div key={question.id} className="p-3 bg-gray-900/50 rounded-md">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{question.question}</p>
                  </div>
                  
                  <div className="ml-6 space-y-1">
                    <p className={`text-xs ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      Your answer: {question.options[userAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-green-400">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-xs text-gray-400 mt-1">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={resetQuiz} variant="outline" size="sm">
              Retake Quiz
            </Button>
          </div>
        </div>
      )
    }

    const question = sampleQuestions[currentQuestion]
    const selectedAnswer = selectedAnswers[question.id]

    return (
      <div className="space-y-4">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Question {currentQuestion + 1} of {sampleQuestions.length}</span>
          <div className="w-32 bg-gray-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-4 bg-gray-900/50 rounded-md">
          <h4 className="font-medium mb-4">{question.question}</h4>
          
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, index)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={handleNextQuestion}
            disabled={selectedAnswer === undefined}
            size="sm"
          >
            {currentQuestion === sampleQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>

        {/* Transcript reference */}
        {transcript && transcript.length > 0 && (
          <div className="mt-4 p-3 bg-gray-900/30 rounded-md">
            <p className="text-xs text-gray-500 mb-2">
              💡 Hint: Review the video transcript below for answers
            </p>
            <div className="max-h-32 overflow-y-auto text-xs text-gray-400 space-y-1">
              {transcript.slice(0, 10).map((item, index) => (
                <div key={index}>
                  <span className="text-gray-500">
                    {Math.floor(item.offset / 60)}:{(item.offset % 60).toString().padStart(2, '0')}
                  </span>
                  {' - '}
                  <span>{item.text}</span>
                </div>
              ))}
              {transcript.length > 10 && (
                <p className="text-gray-500">... and {transcript.length - 10} more items</p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggleOpen} className="mt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-yellow-400">
          <Award className="h-3 w-3 mr-1" />
          Quiz Challenge
          {quizCompleted && <CheckCircle className="h-3 w-3 ml-1 text-green-400" />}
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
        {renderQuizContent()}
      </CollapsibleContent>
    </Collapsible>
  )
}