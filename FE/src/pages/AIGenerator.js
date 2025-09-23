import React, { useState } from "react";
import axios from "axios";
import {
  Zap,
  Send,
  RotateCcw,
  CheckCircle,
  MessageCircle,
  Target,
} from "lucide-react";

const AIGenerator = () => {
  const [activeTab, setActiveTab] = useState("quiz"); // 'quiz', 'chat'

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

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Xin chào! Tôi là AI Assistant của MathAI Learning. Tôi có thể giúp bạn giải thích các khái niệm toán học, giải bài tập, và hướng dẫn học tập. Bạn cần giúp đỡ gì?",
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

  const handleQuizPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
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
  };

  // Chat Functions
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: chatInput.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await axios.post("/api/ai/chat", {
        message: userMessage.content,
        context: chatMessages.slice(-10), // Send last 10 messages for context
      });

      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorResponse = {
        id: Date.now() + 1,
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
            Tạo quiz và trò chuyện với AI để học toán hiệu quả
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
                    placeholder="Ví dụ: Phương trình bậc hai"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cấp độ</label>
                  <select
                    value={quizForm.level}
                    onChange={(e) =>
                      setQuizForm({ ...quizForm, level: e.target.value })
                    }
                    className="form-input"
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
                    className="form-input"
                  >
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                    <option value={10}>10 câu</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={quizLoading}
                  className="btn-primary w-full"
                >
                  {quizLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="spinner-sm"></div>
                      <span>Đang tạo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Tạo Quiz</span>
                    </div>
                  )}
                </button>

                {generatedQuiz && (
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="btn-secondary w-full mt-4"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Tạo Quiz mới
                  </button>
                )}
              </form>
            </div>

            {/* Generated Quiz */}
            <div className="card">
              {!generatedQuiz ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">
                      Tạo quiz để bắt đầu luyện tập
                    </h3>
                  </div>
                </div>
              ) : !showResults ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      Câu {currentQuestion + 1}/{generatedQuiz.length}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {Object.keys(userAnswers).length}/{generatedQuiz.length}{" "}
                      đã trả lời
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / generatedQuiz.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {generatedQuiz[currentQuestion]?.question}
                    </h4>

                    <div className="space-y-3">
                      {generatedQuiz[currentQuestion]?.options?.map(
                        (option, index) => (
                          <label
                            key={index}
                            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                              userAnswers[currentQuestion] === index
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
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
                            <div className="flex items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                  userAnswers[currentQuestion] === index
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {userAnswers[currentQuestion] === index && (
                                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                                )}
                              </div>
                              <span>{option}</span>
                            </div>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleQuizPrev}
                      disabled={currentQuestion === 0}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Câu trước
                    </button>
                    <button
                      onClick={handleQuizNext}
                      disabled={userAnswers[currentQuestion] === undefined}
                      className="btn-primary disabled:opacity-50"
                    >
                      {currentQuestion === generatedQuiz.length - 1
                        ? "Hoàn thành"
                        : "Câu tiếp"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Hoàn thành Quiz!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Điểm số của bạn: {calculateScore()}%
                    </p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button onClick={resetQuiz} className="btn-primary">
                      Làm quiz mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="card h-96 flex flex-col">
                <h2 className="card-title mb-4">AI Chat Assistant</h2>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="spinner-sm"></div>
                          <span className="text-sm">AI đang suy nghĩ...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Hỏi AI về toán học..."
                    className="flex-1 form-input"
                    disabled={chatLoading}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Gợi ý câu hỏi
              </h3>
              <div className="space-y-2">
                {[
                  "Giải thích định lý Pythagore",
                  "Cách giải phương trình bậc hai",
                  "Ứng dụng của logarit trong thực tế",
                  "Sự khác biệt giữa số hữu tỷ và vô tỷ",
                  "Các bước giải bài toán tối ưu",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setChatInput(suggestion)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
