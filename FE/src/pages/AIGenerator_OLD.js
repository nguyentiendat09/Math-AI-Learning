import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Zap,
  Brain,
  Send,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  MessageCircle,
  BookOpen,
  Target,
  Copy,
  Download,
} from "lucide-react";

const AIGenerator = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("quiz"); // 'quiz', 'chat', 'exercises'

  // Quiz Generator State
  const [quizForm, setQuizForm] = useState({
    topic: "",
    level: "Cơ bản",
    numQuestions: 5,
    difficulty: "medium",
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Xin chào! Tôi là AI Assistant của MathAI Learning. Tôi có thể giúp bạn giải thích các khái niệm toán học, giải bài tập, và tạo các bài tập luyện tập. Bạn cần giúp đỡ gì?",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Quiz Generator Functions
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizLoading(true);

    try {
      const response = await axios.post("/api/ai/generate-quiz", {
        topic: quizForm.topic,
        level: quizForm.level,
        numQuestions: quizForm.numQuestions,
        difficulty: quizForm.difficulty,
      });

      setGeneratedQuiz(response.data.quiz);
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
      setReviewMode(false);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleQuizNext = () => {
    if (currentQuestion < generatedQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateQuizScore = () => {
    let correct = 0;
    generatedQuiz.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / generatedQuiz.length) * 100);
  };

  const resetQuiz = () => {
    setGeneratedQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setReviewMode(false);
  };

  // Chat Functions
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, userMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await axios.post("/api/ai/chat", {
        message: currentInput,
        history: chatMessages,
      });

      const aiResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        content: response.data.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorResponse = {
        id: chatMessages.length + 2,
        type: "ai",
        content:
          "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorResponse]);
    } finally {
      setChatLoading(false);
    }
  };

  // Exercise Generator Functions
  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    setExerciseLoading(true);

    try {
      const response = await axios.post("/api/ai/generate-exercises", {
        topic: exerciseForm.topic,
        type: exerciseForm.type,
        level: exerciseForm.level,
        count: exerciseForm.count,
      });

      setGeneratedExercises(response.data.exercises);
      setExerciseAnswers({});
      setExerciseResults({});
    } catch (error) {
      console.error("Failed to generate exercises:", error);
    } finally {
      setExerciseLoading(false);
    }
  };

  // Exercise Interaction Functions
  const handleExerciseAnswer = (exerciseId, answerIndex) => {
    setExerciseAnswers({
      ...exerciseAnswers,
      [exerciseId]: answerIndex,
    });
  };

  const handleTextExerciseAnswer = (exerciseId, textAnswer) => {
    setExerciseAnswers({
      ...exerciseAnswers,
      [exerciseId]: textAnswer,
    });
  };

  const submitExerciseAnswer = (exerciseId) => {
    const exercise = generatedExercises.find((ex) => ex.id === exerciseId);
    const userAnswer = exerciseAnswers[exerciseId];

    // For multiple choice questions
    if (exercise.options) {
      const isCorrect = userAnswer === exercise.correctAnswer;
      setExerciseResults({
        ...exerciseResults,
        [exerciseId]: {
          submitted: true,
          isCorrect,
          userAnswer,
          correctAnswer: exercise.correctAnswer,
        },
      });
    } else {
      // For text-based questions (fill-in-blank, essay)
      setExerciseResults({
        ...exerciseResults,
        [exerciseId]: {
          submitted: true,
          userAnswer,
          sampleAnswer: exercise.answer || exercise.sampleAnswer,
        },
      });
    }
  };

  const tabs = [
    { key: "quiz", label: "Quiz Generator", icon: Target },
    { key: "chat", label: "AI Chat", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Generator
          </h1>
          <p className="text-gray-600">
            Tạo quiz, bài tập và trò chuyện với AI để học toán hiệu quả
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mini-nav-container bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`mini-nav-tab flex-1 px-4 md:px-6 py-4 flex items-center justify-center space-x-2 font-medium text-sm transition-all duration-200 border-r last:border-r-0 cursor-pointer ${
                    activeTab === tab.key
                      ? "active bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz Generator Tab */}
        {activeTab === "quiz" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quiz Form */}
            <div className="card">
              <h2 className="card-title mb-6">Tạo Quiz với AI</h2>
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Chủ đề</label>
                  <input
                    type="text"
                    value={quizForm.topic}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, topic: e.target.value })
                    }
                    className="form-input"
                    placeholder="VD: Phân số, Hình học, Đại số..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mức độ</label>
                  <select
                    value={quizForm.level}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, level: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Số câu hỏi</label>
                  <select
                    value={quizForm.numQuestions}
                    onChange={(e) =>
                      setQuizForm({
                        ...quizForm,
                        numQuestions: parseInt(e.target.value),
                      })
                    }
                    className="form-select"
                  >
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                    <option value={10}>10 câu</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={quizLoading}
                >
                  {quizLoading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Đang tạo quiz...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Tạo Quiz
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quiz Display */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title">Quiz được tạo</h2>
                {generatedQuiz && (
                  <button onClick={resetQuiz} className="btn-secondary">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Tạo mới
                  </button>
                )}
              </div>

              {!generatedQuiz ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Nhập thông tin và tạo quiz để bắt đầu
                  </p>
                </div>
              ) : !showResults ? (
                <div>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        Câu {currentQuestion + 1} / {generatedQuiz.length}
                      </span>
                      <span>
                        {Math.round(
                          ((currentQuestion + 1) / generatedQuiz.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            ((currentQuestion + 1) / generatedQuiz.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {generatedQuiz[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {generatedQuiz[currentQuestion].options.map(
                        (option, index) => (
                          <label
                            key={index}
                            className={`block p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              userAnswers[currentQuestion] === index
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion}`}
                              value={index}
                              checked={userAnswers[currentQuestion] === index}
                              onChange={() =>
                                handleQuizAnswer(currentQuestion, index)
                              }
                              className="sr-only"
                            />
                            <span>{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        setCurrentQuestion(Math.max(0, currentQuestion - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Câu trước
                    </button>

                    <button
                      onClick={handleQuizNext}
                      disabled={userAnswers[currentQuestion] === undefined}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestion === generatedQuiz.length - 1
                        ? "Hoàn thành"
                        : "Câu tiếp"}
                    </button>
                  </div>
                </div>
              ) : reviewMode ? (
                /* Review Mode - Show all questions with answers */
                <div>
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ôn tập bài làm
                    </h3>
                    <p className="text-gray-600">
                      Xem lại các câu hỏi và đáp án đúng
                    </p>
                  </div>

                  <div className="space-y-6">
                    {generatedQuiz.map((question, index) => (
                      <div
                        key={index}
                        className="p-6 border border-gray-200 rounded-lg"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Câu {index + 1}: {question.question}
                        </h4>

                        <div className="space-y-3 mb-4">
                          {question.options.map((option, optionIndex) => {
                            const isCorrect =
                              optionIndex === question.correctAnswer;
                            const isUserAnswer =
                              userAnswers[index] === optionIndex;

                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 border-2 rounded-lg ${
                                  isCorrect
                                    ? "border-green-500 bg-green-50"
                                    : isUserAnswer
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{option}</span>
                                  <div className="flex items-center gap-2">
                                    {isCorrect && (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 mb-1">
                              Giải thích:
                            </p>
                            <p className="text-blue-700 text-sm">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      onClick={() => setReviewMode(false)}
                      className="btn-secondary"
                    >
                      Quay lại kết quả
                    </button>
                    <button onClick={resetQuiz} className="btn-primary">
                      Tạo quiz mới
                    </button>
                  </div>
                </div>
              ) : (
                /* Quiz Results */
                <div className="text-center">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      calculateQuizScore() >= 70 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {calculateQuizScore() >= 70 ? (
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    ) : (
                      <XCircle className="h-10 w-10 text-red-600" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Điểm của bạn: {calculateQuizScore()}%
                  </h3>

                  <p className="text-gray-600 mb-6">
                    Bạn trả lời đúng{" "}
                    {
                      Object.values(userAnswers).filter(
                        (answer, index) =>
                          answer === generatedQuiz[index].correctAnswer
                      ).length
                    }
                    /{generatedQuiz.length} câu
                  </p>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setReviewMode(true)}
                      className="btn-secondary"
                    >
                      Ôn tập lại
                    </button>
                    <button onClick={resetQuiz} className="btn-primary">
                      Tạo quiz mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === "chat" && (
          <div className="card max-w-4xl mx-auto">
            <h2 className="card-title mb-6">Trò chuyện với AI Assistant</h2>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-blue-200"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="spinner"></div>
                      <span className="text-sm text-gray-600">
                        AI đang suy nghĩ...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="form-input flex-1"
                placeholder="Hỏi gì đó về toán học..."
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={chatLoading || !chatInput.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Suggestions */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Giải thích định lý Pythagore",
                  "Cách tính phân số",
                  "Ứng dụng của số nguyên",
                  "Tạo bài tập về hình học",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setChatInput(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exercise Generator Tab */}
        {activeTab === "exercises" && (
          <div className="text-center py-12">
            <p className="text-gray-500">Chức năng bài tập đã được tắt</p>
          </div>
        )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Exercise Form */}
            <div className="card">
              <h2 className="card-title mb-6">Tạo bài tập</h2>
              <form onSubmit={handleExerciseSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Chủ đề</label>
                  <input
                    type="text"
                    value={exerciseForm.topic}
                    onChange={(e) =>
                      setExerciseForm({
                        ...exerciseForm,
                        topic: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="VD: Phương trình bậc nhất"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loại bài tập</label>
                  <select
                    value={exerciseForm.type}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, type: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="multiple-choice">Trắc nghiệm</option>
                    <option value="fill-blank">Điền vào chỗ trống</option>
                    <option value="essay">Tự luận</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mức độ</label>
                  <select
                    value={exerciseForm.level}
                    onChange={(e) =>
                      setExerciseForm({
                        ...exerciseForm,
                        level: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={exerciseLoading}
                >
                  {exerciseLoading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Tạo bài tập
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Exercises */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title">Bài tập được tạo</h2>
                  {generatedExercises && (
                    <div className="flex space-x-2">
                      <button className="btn-secondary">
                        <Copy className="h-4 w-4 mr-2" />
                        Sao chép
                      </button>
                      <button className="btn-secondary">
                        <Download className="h-4 w-4 mr-2" />
                        Tải về
                      </button>
                    </div>
                  )}
                </div>

                {!generatedExercises ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Tạo bài tập để xem kết quả</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {generatedExercises.map((exercise, index) => {
                      const result = exerciseResults[exercise.id];
                      const userAnswer = exerciseAnswers[exercise.id];

                      return (
                        <div
                          key={exercise.id}
                          className="p-6 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {exercise.question}
                            </h3>
                            <span className="badge badge-primary">
                              {exercise.type}
                            </span>
                          </div>

                          <div className="mb-4">
                            <p className="text-gray-700">{exercise.content}</p>
                          </div>

                          {exercise.options && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-600 mb-2">
                                Các lựa chọn:
                              </p>
                              <div className="space-y-3">
                                {exercise.options.map((option, i) => {
                                  const isCorrect =
                                    result && i === exercise.correctAnswer;
                                  const isUserAnswer =
                                    result && i === userAnswer;

                                  return (
                                    <label
                                      key={i}
                                      className={`block p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                        result
                                          ? isCorrect
                                            ? "border-green-500 bg-green-50"
                                            : isUserAnswer
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200"
                                          : userAnswer === i
                                          ? "border-blue-500 bg-blue-50"
                                          : "border-gray-200 hover:border-gray-300"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`exercise-${exercise.id}`}
                                        value={i}
                                        checked={userAnswer === i}
                                        onChange={() =>
                                          !result &&
                                          handleExerciseAnswer(exercise.id, i)
                                        }
                                        disabled={result}
                                        className="sr-only"
                                      />
                                      <div className="flex items-center justify-between">
                                        <span>
                                          {String.fromCharCode(65 + i)}.{" "}
                                          {option}
                                        </span>
                                        {result && (
                                          <div className="flex items-center gap-2">
                                            {isCorrect && (
                                              <CheckCircle className="h-5 w-5 text-green-600" />
                                            )}
                                            {isUserAnswer && !isCorrect && (
                                              <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>

                              {!result ? (
                                <div className="mt-4">
                                  <button
                                    onClick={() =>
                                      submitExerciseAnswer(exercise.id)
                                    }
                                    disabled={userAnswer === undefined}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Kiểm tra đáp án
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-4">
                                  <div
                                    className={`p-3 rounded-lg ${
                                      result.isCorrect
                                        ? "bg-green-50"
                                        : "bg-red-50"
                                    }`}
                                  >
                                    <p
                                      className={`text-sm font-medium mb-1 ${
                                        result.isCorrect
                                          ? "text-green-800"
                                          : "text-red-800"
                                      }`}
                                    >
                                      {result.isCorrect
                                        ? "✅ Chính xác!"
                                        : "❌ Chưa đúng"}
                                    </p>
                                    {!result.isCorrect && (
                                      <p className="text-green-700 text-sm">
                                        Đáp án đúng:{" "}
                                        {String.fromCharCode(
                                          65 + exercise.correctAnswer
                                        )}
                                      </p>
                                    )}
                                    {exercise.explanation && (
                                      <p className="text-gray-600 text-sm mt-2">
                                        <strong>Giải thích:</strong>{" "}
                                        {exercise.explanation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* For non-multiple-choice exercises (fill-in-blank, essay) */}
                          {!exercise.options && (
                            <div className="mb-4">
                              {!result ? (
                                <div>
                                  <div className="mb-4">
                                    {exercise.type === "fill-in-blank" ? (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                          Điền vào chỗ trống:
                                        </label>
                                        <input
                                          type="text"
                                          value={userAnswer || ""}
                                          onChange={(e) =>
                                            handleTextExerciseAnswer(
                                              exercise.id,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Nhập câu trả lời của bạn..."
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                          Câu trả lời của bạn:
                                        </label>
                                        <textarea
                                          value={userAnswer || ""}
                                          onChange={(e) =>
                                            handleTextExerciseAnswer(
                                              exercise.id,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Viết câu trả lời của bạn..."
                                          rows="4"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() =>
                                      submitExerciseAnswer(exercise.id)
                                    }
                                    disabled={
                                      !userAnswer || userAnswer.trim() === ""
                                    }
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Xem đáp án
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {/* Show user's answer */}
                                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800 mb-1">
                                      Câu trả lời của bạn:
                                    </p>
                                    <p className="text-blue-700">
                                      {result.userAnswer || "(Chưa trả lời)"}
                                    </p>
                                  </div>

                                  {/* Show sample answer */}
                                  <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm font-medium text-green-800 mb-1">
                                      Đáp án mẫu:
                                    </p>
                                    <p className="text-green-700">
                                      {result.sampleAnswer}
                                    </p>
                                    {exercise.explanation && (
                                      <p className="text-green-600 text-sm mt-2">
                                        <strong>Giải thích:</strong>{" "}
                                        {exercise.explanation}
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-4">
                                    <button
                                      onClick={() => {
                                        // Reset this exercise to allow re-answering
                                        const newAnswers = {
                                          ...exerciseAnswers,
                                        };
                                        const newResults = {
                                          ...exerciseResults,
                                        };
                                        delete newAnswers[exercise.id];
                                        delete newResults[exercise.id];
                                        setExerciseAnswers(newAnswers);
                                        setExerciseResults(newResults);
                                      }}
                                      className="btn-secondary"
                                    >
                                      Thử lại
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Summary and Reset Button */}
                    {generatedExercises.length > 0 && (
                      <div className="text-center pt-6 border-t">
                        <div className="mb-4">
                          <p className="text-gray-600">
                            Đã hoàn thành: {Object.keys(exerciseResults).length}
                            /{generatedExercises.length} bài tập
                          </p>

                          {/* Show accuracy for multiple choice questions only */}
                          {generatedExercises.some((ex) => ex.options) &&
                            Object.values(exerciseResults).some(
                              (r) => r.isCorrect !== undefined
                            ) && (
                              <p className="text-green-600 font-medium mt-2">
                                Tỷ lệ đúng (trắc nghiệm):{" "}
                                {Math.round(
                                  (Object.values(exerciseResults).filter(
                                    (r) => r.isCorrect === true
                                  ).length /
                                    Object.values(exerciseResults).filter(
                                      (r) => r.isCorrect !== undefined
                                    ).length) *
                                    100
                                )}
                                %
                              </p>
                            )}
                        </div>
                        <button
                          onClick={resetExercises}
                          className="btn-primary"
                        >
                          Tạo bài tập mới
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
