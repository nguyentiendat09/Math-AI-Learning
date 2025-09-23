import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Plus,
  Clock,
  Calendar,
  BookOpen,
  Save,
  X,
  Trash2,
  Copy,
  Eye,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";

const QuizCreate = () => {
  const { classroomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    questions: [
      {
        id: 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
  });

  useEffect(() => {
    if (user?.role !== "teacher") {
      navigate("/");
      return;
    }

    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setQuiz((prev) => ({
      ...prev,
      startDate: today.toISOString().split("T")[0],
      startTime: "08:00",
      endDate: tomorrow.toISOString().split("T")[0],
      endTime: "23:59",
    }));
  }, [user, navigate]);

  const addQuestion = () => {
    const newQuestion = {
      id: quiz.questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = quiz.questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = quiz.questions.map((q, i) => {
      if (i === questionIndex) {
        const updatedOptions = q.options.map((opt, j) =>
          j === optionIndex ? value : opt
        );
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteQuestion = (index) => {
    if (quiz.questions.length === 1) return;
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...quiz.questions[index] };
    questionToDuplicate.id = quiz.questions.length + 1;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index + 1, 0, questionToDuplicate);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSave = () => {
    // Validate quiz
    if (!quiz.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài quiz");
      return;
    }

    if (quiz.questions.some((q) => !q.question.trim())) {
      alert("Vui lòng điền đầy đủ câu hỏi");
      return;
    }

    if (quiz.questions.some((q) => q.options.some((opt) => !opt.trim()))) {
      alert("Vui lòng điền đầy đủ các lựa chọn");
      return;
    }

    // Save quiz (mock)
    console.log("Saving quiz:", quiz);
    alert("Đã tạo bài quiz thành công!");
    navigate(`/classroom/${classroomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/classroom/${classroomId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tạo bài quiz mới
                </h1>
                <p className="text-gray-600">
                  Tạo bài kiểm tra cho học sinh trong lớp
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/classroom/${classroomId}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Lưu bài quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Thông tin bài quiz
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài quiz
              </label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Bài kiểm tra toán học chương 1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={quiz.description}
                onChange={(e) =>
                  setQuiz({ ...quiz, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả về nội dung bài quiz..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian làm bài (phút)
              </label>
              <input
                type="number"
                value={quiz.timeLimit}
                onChange={(e) =>
                  setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })
                }
                min="1"
                max="180"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số câu hỏi
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">
                  {quiz.questions.length}
                </span>
                <span className="text-gray-600">câu hỏi</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian bắt đầu
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={quiz.startDate}
                  onChange={(e) =>
                    setQuiz({ ...quiz, startDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={quiz.startTime}
                  onChange={(e) =>
                    setQuiz({ ...quiz, startTime: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian kết thúc
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={quiz.endDate}
                  onChange={(e) =>
                    setQuiz({ ...quiz, endDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={quiz.endTime}
                  onChange={(e) =>
                    setQuiz({ ...quiz, endTime: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Câu hỏi {questionIndex + 1}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => duplicateQuestion(questionIndex)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Sao chép câu hỏi"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {quiz.questions.length > 1 && (
                    <button
                      onClick={() => deleteQuestion(questionIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung câu hỏi
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "question", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập câu hỏi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Các lựa chọn
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}-correct`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() =>
                            updateQuestion(
                              questionIndex,
                              "correctAnswer",
                              optionIndex
                            )
                          }
                          className="h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700 w-8">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Lựa chọn ${String.fromCharCode(
                            65 + optionIndex
                          )}`}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Chọn radio button để đánh dấu đáp án đúng
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giải thích (tùy chọn)
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) =>
                      updateQuestion(
                        questionIndex,
                        "explanation",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Giải thích tại sao đáp án này đúng..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="text-center">
          <button
            onClick={addQuestion}
            className="flex items-center space-x-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 px-6 py-4 rounded-xl transition-all cursor-pointer mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Thêm câu hỏi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreate;
