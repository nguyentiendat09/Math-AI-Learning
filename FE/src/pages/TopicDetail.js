import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
  History,
  Lightbulb,
  Zap,
} from "lucide-react";

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, canAccessLevel } = useAuth();

  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchTopicDetail();
    fetchProgress();
  }, [id]);

  const fetchTopicDetail = () => {
    try {
      console.log("🔍 Fetching topic detail for ID:", id);
      setLoading(true);

      // Mock topics data
      const mockTopics = [
        {
          id: 1,
          title: "Số nguyên",
          description: "Khám phá thế giới số âm và số dương",
          level: "Lớp 6",
          category: "Đại số",
          xp: 100,
          knowledge: {
            theory:
              "Số nguyên bao gồm các số âm, số không và các số dương. Chúng được biểu diễn trên trục số và có các quy tắc tính toán riêng.",
            examples: ["Ví dụ 1: -5 + 3 = -2", "Ví dụ 2: (-2) × 4 = -8"],
            history:
              "Số nguyên được phát triển từ thời cổ đại để giải quyết các bài toán về nợ nần và nhiệt độ.",
            application:
              "Số nguyên được sử dụng trong nhiều lĩnh vực như kinh tế, khoa học, và đời sống hàng ngày.",
          },
          content: {
            knowledge:
              "Số nguyên bao gồm các số âm, số không và các số dương. Chúng được biểu diễn trên trục số và có các quy tắc tính toán riêng.\n\nCác tính chất cơ bản:\n- Phép cộng số nguyên\n- Phép trừ số nguyên\n- Phép nhân và chia số nguyên",
            history:
              "Số nguyên được phát triển từ thời cổ đại để giải quyết các bài toán về nợ nần và nhiệt độ. Người Ấn Độ cổ đại đã sử dụng số âm từ thế kỷ thứ 7.\n\nCác mốc lịch sử quan trọng:\n- Thế kỷ 7: Người Ấn Độ sử dụng số âm\n- Thế kỷ 13: Fibonacci giới thiệu số âm vào châu Âu",
            application:
              "Số nguyên được sử dụng trong nhiều lĩnh vực như kinh tế, khoa học, và đời sống hàng ngày.\n\nỨng dụng thực tế:\n- Tính toán nhiệt độ (âm/dương)\n- Tài chính (lãi/lỗ)\n- Độ cao (trên/dưới mực nước biển)\n- Lập trình máy tính",
          },
          videos: [],
          quizzes: [
            {
              id: 1,
              question: "Kết quả của phép tính (-3) + 5 là:",
              answers: ["2", "-2", "8", "-8"],
              correctAnswer: 0,
              explanation:
                "(-3) + 5 = 2 vì ta cộng số âm với số dương lớn hơn.",
            },
          ],
        },
        {
          id: 2,
          title: "Phân số",
          description: "Hiểu về các phần của một tổng thể",
          level: "Lớp 6",
          category: "Đại số",
          xp: 120,
          knowledge: {
            theory:
              "Phân số là cách biểu diễn một phần của tổng thể. Gồm tử số và mẫu số.",
            examples: ["Ví dụ 1: 1/2 + 1/4 = 3/4", "Ví dụ 2: 2/3 × 3/4 = 1/2"],
            history: "Phân số được sử dụng từ thời Ai Cập cổ đại.",
            application: "Phân số được dùng trong nấu ăn, xây dựng, khoa học.",
          },
          content: {
            knowledge:
              "Phân số là cách biểu diễn một phần của tổng thể. Gồm tử số và mẫu số.\n\nCác khái niệm cơ bản:\n- Tử số: số ở trên\n- Mẫu số: số ở dưới\n- Phân số tối giản\n- So sánh phân số",
            history:
              "Phân số được sử dụng từ thời Ai Cập cổ đại. Người Ai Cập cổ đại đã biết cách sử dụng phân số đơn vị từ 3000 năm trước Công nguyên.",
            application:
              "Phân số được dùng trong nấu ăn, xây dựng, khoa học.\n\nVí dụ ứng dụng:\n- Công thức nấu ăn (1/2 cốc bột)\n- Đo lường xây dựng\n- Tỷ lệ hóa học",
          },
          videos: [],
          quizzes: [
            {
              id: 1,
              question: "Kết quả của phép tính 1/2 + 1/4 là:",
              answers: ["3/4", "2/6", "1/6", "3/6"],
              correctAnswer: 0,
              explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4",
            },
          ],
        },
        {
          id: 3,
          title: "Định lý Pythagore",
          description: "Khám phá mối quan hệ giữa các cạnh tam giác vuông",
          level: "Lớp 8",
          category: "Hình học",
          xp: 150,
          knowledge: {
            theory:
              "Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.",
            examples: [
              "Ví dụ 1: Tam giác vuông có hai cạnh góc vuông là 3 và 4, cạnh huyền là 5",
            ],
            history:
              "Định lý được đặt tên theo nhà toán học Hy Lạp Pythagoras.",
            application:
              "Định lý Pythagore được sử dụng trong xây dựng, navigation, computer graphics.",
          },
          content: {
            knowledge:
              "Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.\n\nCông thức: a² + b² = c²\n\nTrong đó:\n- a, b là hai cạnh góc vuông\n- c là cạnh huyền",
            history:
              "Định lý được đặt tên theo nhà toán học Hy Lạp Pythagoras (khoảng 570-495 TCN). Tuy nhiên, định lý này đã được biết đến từ thời Babylon cổ đại.",
            application:
              "Định lý Pythagore được sử dụng trong xây dựng, navigation, computer graphics.\n\nỨng dụng:\n- Tính khoảng cách\n- Thiết kế kiến trúc\n- GPS và định vị\n- Đồ họa máy tính",
          },
          videos: [],
          quizzes: [
            {
              id: 1,
              question:
                "Trong tam giác vuông với hai cạnh góc vuông là 3 và 4, cạnh huyền là:",
              answers: ["5", "6", "7", "8"],
              correctAnswer: 0,
              explanation: "Theo định lý Pythagore: 3² + 4² = 9 + 16 = 25 = 5²",
            },
          ],
        },
        {
          id: 4,
          title: "Xác suất cơ bản",
          description: "Tính toán khả năng xảy ra của các sự kiện",
          level: "Lớp 7",
          category: "Thống kê",
          xp: 130,
          knowledge: {
            theory: "Xác suất là thước đo khả năng xảy ra của một sự kiện.",
            examples: ["Ví dụ 1: Xác suất tung đồng xu được mặt ngửa là 1/2"],
            history: "Lý thuyết xác suất được phát triển bởi Pascal và Fermat.",
            application:
              "Xác suất được dùng trong thống kê, kinh tế, khoa học.",
          },
          content: {
            knowledge:
              "Xác suất là thước đo khả năng xảy ra của một sự kiện.\n\nCông thức cơ bản:\n- P(A) = Số kết quả thuận lợi / Tổng số kết quả có thể\n- 0 ≤ P(A) ≤ 1\n\nTính chất:\n- P(A) + P(A') = 1\n- P(∅) = 0 (sự kiện không thể)\n- P(Ω) = 1 (sự kiện chắc chắn)",
            history:
              "Lý thuyết xác suất được phát triển bởi Pascal và Fermat vào thế kỷ 17. Họ đã nghiên cứu để giải quyết các vấn đề về cờ bạc.\n\nCác mốc quan trọng:\n- 1654: Pascal và Fermat trao đổi thư về chia tiền cược\n- 1713: Jakob Bernoulli xuất bản 'Ars Conjectandi'\n- 1933: Kolmogorov thiết lập nền tảng toán học hiện đại",
            application:
              "Xác suất được dùng trong thống kê, kinh tế, khoa học.\n\nỨng dụng thực tế:\n- Dự báo thời tiết\n- Bảo hiểm và tài chính\n- Y học và dược phẩm\n- Trò chơi và thể thao\n- Khoa học dữ liệu",
          },
          videos: [],
          quizzes: [
            {
              id: 1,
              question: "Xác suất tung đồng xu được mặt ngửa là:",
              answers: ["1/4", "1/2", "3/4", "1"],
              correctAnswer: 1,
              explanation: "Đồng xu có 2 mặt, xác suất được mặt ngửa là 1/2",
            },
          ],
        },
        {
          id: 5,
          title: "Hệ phương trình bậc nhất",
          description: "Giải hệ phương trình với hai ẩn số",
          level: "Lớp 9",
          category: "Đại số",
          xp: 180,
          knowledge: {
            theory:
              "Hệ phương trình bậc nhất là tập hợp các phương trình bậc nhất có cùng ẩn số.",
            examples: [
              "Ví dụ 1: Giải hệ {x + y = 5; x - y = 1} được x = 3, y = 2",
            ],
            history:
              "Phương pháp giải hệ phương trình được phát triển từ thời cổ đại.",
            application:
              "Hệ phương trình được dùng trong kinh tế, kỹ thuật, khoa học.",
          },
          content: {
            knowledge:
              "Hệ phương trình bậc nhất là tập hợp các phương trình bậc nhất có cùng ẩn số.\n\nDạng tổng quát hệ 2 phương trình 2 ẩn:\n{ax + by = c\n{dx + ey = f\n\nPhương pháp giải:\n1. Phương pháp thế\n2. Phương pháp cộng đại số\n3. Phương pháp đồ thị\n4. Sử dụng định thức (Cramer)",
            history:
              "Phương pháp giải hệ phương trình được phát triển từ thời cổ đại.\n\nLịch sử phát triển:\n- Babylon cổ đại: Giải các bài toán đơn giản\n- Trung Quốc cổ đại: Phương pháp khử Gauss\n- Thế kỷ 18: Cramer phát triển quy tắc định thức\n- Thế kỷ 19: Gauss hoàn thiện phương pháp khử",
            application:
              "Hệ phương trình được dùng trong kinh tế, kỹ thuật, khoa học.\n\nỨng dụng thực tế:\n- Tối ưu hóa sản xuất\n- Phân tích thị trường\n- Mạch điện\n- Cân bằng hóa học\n- Mô hình kinh tế",
          },
          videos: [],
          quizzes: [
            {
              id: 1,
              question: "Nghiệm của hệ phương trình {x + y = 5; x - y = 1} là:",
              answers: [
                "x = 3, y = 2",
                "x = 2, y = 3",
                "x = 4, y = 1",
                "x = 1, y = 4",
              ],
              correctAnswer: 0,
              explanation:
                "Cộng hai phương trình: 2x = 6 → x = 3. Thế vào: 3 + y = 5 → y = 2",
            },
          ],
        },
      ];

      // Get topics from localStorage
      const localTopics = JSON.parse(localStorage.getItem("topics") || "[]");

      // Combine mock topics with localStorage topics
      const allTopics = [...mockTopics, ...localTopics];

      // Find topic by ID
      const foundTopic = allTopics.find(
        (t) => t.id === parseInt(id) || t.id === id
      );

      if (foundTopic) {
        // Check grade access for students
        if (user?.role === "student" && !canAccessLevel(foundTopic.level)) {
          console.log("❌ Grade access denied for topic:", foundTopic.title);
          alert(
            `Bạn chỉ có thể học chủ đề đúng lớp của mình!\n\nChủ đề "${foundTopic.title}" dành cho ${foundTopic.level}.\nBạn hiện tại đang ở lớp ${user.grade}.`
          );
          navigate("/learning-map");
          return;
        }

        setTopic(foundTopic);
        console.log("✅ Topic found:", foundTopic);
      } else {
        console.log("❌ Topic not found for ID:", id);
        setTopic(null);
      }
    } catch (error) {
      console.error("❌ Failed to fetch topic:", error);
      setTopic(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = () => {
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem("userProgress") || "[]"
      );
      const topicProgress = savedProgress.find(
        (p) => p.topicId === parseInt(id)
      );
      setProgress(topicProgress || null);
      console.log("📊 Progress loaded:", topicProgress);
    } catch (error) {
      console.error("❌ Failed to fetch progress:", error);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (
      topic.quizzes &&
      Array.isArray(topic.quizzes) &&
      currentQuestion < topic.quizzes.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = () => {
    if (
      !topic.quizzes ||
      !Array.isArray(topic.quizzes) ||
      topic.quizzes.length === 0
    ) {
      alert("Chưa có câu hỏi cho chủ đề này!");
      return;
    }

    let correctAnswers = 0;
    topic.quizzes.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / topic.quizzes.length) * 100);
    setQuizScore(score);
    setQuizCompleted(true);

    // Save progress to localStorage
    try {
      const savedProgress = JSON.parse(
        localStorage.getItem("userProgress") || "[]"
      );
      const filteredProgress = savedProgress.filter(
        (p) => p.topicId !== parseInt(id)
      );

      const newProgress = {
        topicId: parseInt(id),
        score: score,
        completed: score >= 70,
        completedAt: new Date().toISOString(),
        answers: selectedAnswers,
      };

      filteredProgress.push(newProgress);
      localStorage.setItem("userProgress", JSON.stringify(filteredProgress));

      console.log("💾 Progress saved:", newProgress);

      // Update user XP if completed
      if (score >= 70 && (!progress || !progress.completed)) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const newXP = (currentUser.xp || 0) + (topic.xp || 100);
        const newLevel = Math.floor(newXP / 500) + 1;

        const updatedUser = { ...currentUser, xp: newXP, level: newLevel };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        updateUser(updatedUser);

        console.log("🎯 XP updated:", {
          oldXP: currentUser.xp,
          newXP,
          level: newLevel,
        });
      }
    } catch (error) {
      console.error("❌ Failed to save progress:", error);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy chủ đề
          </h2>
          <button
            onClick={() => navigate("/learning-map")}
            className="btn-primary"
          >
            Về Bản đồ học tập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>

          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="badge badge-primary">{topic.level}</span>
                  <span className="badge badge-warning">{topic.category}</span>
                  {progress && progress.completed && (
                    <span className="badge badge-success">Đã hoàn thành</span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {topic.title}
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  {topic.description}
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{topic.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-600">{topic.xp} XP</span>
                  </div>
                  {progress && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">
                        Điểm: {progress.score}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Bar - Always visible */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveTab("overview");
                setShowQuiz(false);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "overview" && !showQuiz
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Thông tin chủ đề
            </button>

            <button
              onClick={() => {
                setActiveTab("video");
                setShowQuiz(false);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "video" && !showQuiz
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Video
            </button>

            <button
              onClick={() => setShowQuiz(true)}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                showQuiz
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Zap className="h-4 w-4 mr-2" />
              Quiz
            </button>

            <button
              onClick={() => {
                setActiveTab("knowledge");
                setShowQuiz(false);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "knowledge" && !showQuiz
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Kiến thức
            </button>

            <button
              onClick={() => {
                setActiveTab("history");
                setShowQuiz(false);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "history" && !showQuiz
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              Lịch sử
            </button>

            <button
              onClick={() => {
                setActiveTab("application");
                setShowQuiz(false);
              }}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === "application" && !showQuiz
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Ứng dụng
            </button>
          </div>
        </div>

        {!showQuiz ? (
          <>
            {/* Overview Section */}
            {activeTab === "overview" && (
              <div className="card mb-8">
                <h2 className="card-title mb-6">Tổng quan chủ đề</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                    <p className="text-gray-700">{topic.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Cấp độ
                        </span>
                      </div>
                      <p className="text-blue-700">{topic.level}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">
                          Danh mục
                        </span>
                      </div>
                      <p className="text-green-700">{topic.category}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">
                          Điểm XP
                        </span>
                      </div>
                      <p className="text-yellow-700">{topic.xp} XP</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Section */}
            {activeTab === "video" && (
              <div className="card mb-8">
                <h2 className="card-title mb-6">Video bài học</h2>
                {topic.videos &&
                Array.isArray(topic.videos) &&
                topic.videos.length > 0 ? (
                  <div className="space-y-4">
                    {topic.videos.map((video, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {video.title || `Video ${index + 1}`}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {video.description}
                          </p>
                        )}

                        {/* Debug video data */}
                        {console.log(`🎥 Video ${index + 1} debug:`, {
                          title: video.title,
                          hasUrl: !!video.url,
                          hasFile: !!video.file,
                          uploadType: video.uploadType,
                          urlType: video.url
                            ? video.url.startsWith("data:")
                              ? "base64"
                              : "url"
                            : "none",
                          urlPreview: video.url
                            ? video.url.substring(0, 50) + "..."
                            : "none",
                        })}

                        {video.url ? (
                          video.url.includes("youtube.com") ||
                          video.url.includes("youtu.be") ? (
                            <div className="w-full h-96 bg-black rounded-lg overflow-hidden">
                              <iframe
                                src={video.url.replace("watch?v=", "embed/")}
                                title={video.title || `Video ${index + 1}`}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <div className="w-full h-96 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                              <video
                                controls
                                className="w-full h-full"
                                src={video.url}
                              >
                                Trình duyệt của bạn không hỗ trợ video.
                              </video>
                            </div>
                          )
                        ) : video.file || video.uploadType === "file" ? (
                          <div className="w-full h-96 bg-black rounded-lg overflow-hidden flex items-center justify-center">
                            <video
                              controls
                              className="w-full h-full"
                              src={
                                // Ưu tiên base64 data nếu có
                                video.file?.data ||
                                // Hoặc URL nếu là base64
                                (video.url && video.url.startsWith("data:"))
                                  ? video.url
                                  : // Hoặc xử lý file object/string
                                  typeof video.file === "string"
                                  ? video.file
                                  : video.file && video.file.url
                                  ? video.file.url
                                  : video.file instanceof File
                                  ? URL.createObjectURL(video.file)
                                  : video.url || ""
                              }
                            >
                              Trình duyệt của bạn không hỗ trợ video.
                            </video>
                          </div>
                        ) : (
                          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">
                              Không có video để hiển thị
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="h-12 w-12 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        Chưa có video bài học
                      </p>
                      <p className="text-sm text-gray-400">
                        Video sẽ được cập nhật sau
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content Sections */}
            {(activeTab === "knowledge" ||
              activeTab === "history" ||
              activeTab === "application") && (
              <div className="card">
                <div className="prose max-w-none">
                  {activeTab === "knowledge" && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Kiến thức cơ bản
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {topic.content?.knowledge ||
                          topic.knowledge?.theory ||
                          "Nội dung kiến thức sẽ được cập nhật sau."}
                      </div>
                    </div>
                  )}

                  {activeTab === "history" && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Lịch sử phát triển
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {topic.content?.history ||
                          topic.knowledge?.history ||
                          "Nội dung lịch sử sẽ được cập nhật sau."}
                      </div>
                    </div>
                  )}

                  {activeTab === "application" && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Ứng dụng thực tiễn
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {topic.content?.application ||
                          topic.knowledge?.application ||
                          "Nội dung ứng dụng sẽ được cập nhật sau."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card">
            {!topic.quizzes ||
            !Array.isArray(topic.quizzes) ||
            topic.quizzes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-medium">Chưa có câu hỏi</h3>
                  <p className="text-sm">Chủ đề này chưa có câu hỏi quiz.</p>
                </div>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="btn-primary inline-flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Xem bài học
                </button>
              </div>
            ) : !quizCompleted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title">Quiz - {topic.title}</h2>
                  <div className="text-sm text-gray-600">
                    Câu {currentQuestion + 1} / {topic.quizzes.length}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          ((currentQuestion + 1) /
                            (topic.quizzes?.length || 1)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {topic.quizzes[currentQuestion]?.question ||
                      "Đang tải câu hỏi..."}
                  </h3>

                  <div className="space-y-3">
                    {(
                      topic.quizzes[currentQuestion]?.answers ||
                      topic.quizzes[currentQuestion]?.options ||
                      []
                    )?.map((option, index) => (
                      <label
                        key={index}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={index}
                          checked={selectedAnswers[currentQuestion] === index}
                          onChange={() =>
                            handleAnswerSelect(currentQuestion, index)
                          }
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              selectedAnswers[currentQuestion] === index
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswers[currentQuestion] === index && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Câu trước
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === topic.quizzes.length - 1
                      ? "Hoàn thành"
                      : "Câu tiếp"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    {quizScore >= 70 ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {quizScore >= 70 ? "Chúc mừng!" : "Cần cải thiện"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bạn đã đạt {quizScore}% điểm số.
                  </p>
                  {quizScore >= 70 ? (
                    <p className="text-green-600 font-medium">
                      Bạn đã hoàn thành chủ đề này!
                    </p>
                  ) : (
                    <p className="text-orange-600 font-medium">
                      Hãy ôn lại bài học và thử lại nhé!
                    </p>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <button onClick={resetQuiz} className="btn-secondary">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Làm lại
                  </button>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="btn-primary"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Xem bài học
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;
