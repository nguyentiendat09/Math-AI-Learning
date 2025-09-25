import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Plus,
  BarChart3,
  Clock,
  Calendar,
  Award,
  Settings,
  Copy,
  User,
  Trophy,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";
import { getClassroomById } from "../data/classrooms";

const ClassroomDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    if (user?.role !== "teacher") {
      navigate("/");
      return;
    }
    loadClassroomData();
  }, [id, user, navigate]);

  const loadClassroomData = () => {
    console.log("🔍 ClassroomDetail - Loading classroom with ID:", id);

    // Use shared classroom data by ID
    const sharedClassroom = getClassroomById(id);
    console.log(
      "📚 ClassroomDetail - Shared classroom found:",
      sharedClassroom
    );

    // Use shared data if available, otherwise fallback to mock
    const mockClassroom = sharedClassroom || {
      id: parseInt(id),
      name: "Lớp học không tồn tại",
      description: "Lớp học này không tồn tại trong hệ thống",
      subject: "Toán học",
      grade: 7,
      code: "UNKNOWN",
      studentCount: 0,
      quizCount: 0,
      createdAt: new Date().toISOString(),
      isActive: false,
    };

    console.log("✅ ClassroomDetail - Final classroom used:", mockClassroom);
    setClassroom(mockClassroom);

    // Mock students data - empty for new classrooms, sample for demo classrooms
    const mockStudents =
      mockClassroom.studentCount > 0
        ? [
            {
              id: 1,
              name: "Nguyễn Văn An",
              email: "an@student.com",
              level: 4,
              xp: 1850,
              completedQuizzes: 3,
              averageScore: 85,
              joinedAt: "2024-09-02",
              lastActive: "2024-09-20",
            },
            {
              id: 2,
              name: "Trần Thị Bình",
              email: "binh@student.com",
              level: 5,
              xp: 2100,
              completedQuizzes: 4,
              averageScore: 92,
              joinedAt: "2024-09-03",
              lastActive: "2024-09-21",
            },
            {
              id: 3,
              name: "Lê Văn Cường",
              email: "cuong@student.com",
              level: 3,
              xp: 1200,
              completedQuizzes: 2,
              averageScore: 78,
              joinedAt: "2024-09-04",
              lastActive: "2024-09-19",
            },
          ]
        : []; // Empty array for new classrooms
    setStudents(mockStudents);

    // Mock quizzes data - empty for new classrooms, sample for demo classrooms
    const mockQuizzes =
      mockClassroom.quizCount > 0
        ? [
            {
              id: 1,
              title: "Bài kiểm tra ngắn về đơn thức",
              description:
                "Kiểm tra kiến thức về đơn thức, đơn thức thu gọn và đơn thức đồng dạng",
              questionCount: 10,
              timeLimit: 30,
              startTime: "2024-09-15T08:00:00",
              endTime: "2024-09-15T23:59:59",
              status: "completed",
              submissions: 22,
              averageScore: 84,
              maxScore: 98,
              minScore: 65,
            },
            {
              id: 2,
              title: "Đa thức",
              description: "Bài tập về phép cộng, trừ, nhân, chia đa thức",
              questionCount: 15,
              timeLimit: 45,
              startTime: "2024-09-22T08:00:00",
              endTime: "2024-09-22T23:59:59",
              status: "active",
              submissions: 18,
              averageScore: null,
              maxScore: null,
              minScore: null,
            },
            {
              id: 3,
              title: "Tứ giác",
              description: "Bài tập các hình khối cơ bản",
              questionCount: 12,
              timeLimit: 40,
              startTime: "2024-09-25T08:00:00",
              endTime: "2024-09-25T23:59:59",
              status: "upcoming",
              submissions: 0,
              averageScore: null,
              maxScore: null,
              minScore: null,
            },
          ]
        : []; // Empty array for new classrooms
    setQuizzes(mockQuizzes);
  };

  const copyClassCode = () => {
    navigator.clipboard.writeText(classroom?.code);
    // Add toast notification
  };

  const getQuizStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQuizStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      case "scheduled":
        return "Sắp diễn ra";
      default:
        return "Chưa xác định";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (!classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu lớp học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/classroom-management")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {classroom.name}
                </h1>
                <p className="text-gray-600">{classroom.description}</p>
              </div>
            </div>

            {/* Class Code */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Mã lớp học
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg font-bold text-blue-700">
                      {classroom.code}
                    </span>
                  </div>
                </div>
                <button
                  onClick={copyClassCode}
                  className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Sao chép mã lớp"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Học sinh</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classroom.studentCount}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bài quiz</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classroom.quizCount}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Điểm TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classroom?.calculatedAverageScore || "--"}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    students.filter(
                      (s) =>
                        new Date(s.lastActive) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b">
            <nav className="flex space-x-3">
              <button
                onClick={() => setActiveTab("students")}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 border-2 ${
                  activeTab === "students"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "text-gray-600 border-gray-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Học sinh</span>
              </button>
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 border-2 ${
                  activeTab === "quizzes"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "text-gray-600 border-gray-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Bài quiz</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Danh sách học sinh ({students.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Học sinh
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Level/XP
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Bài đã làm
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Điểm TB
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Hoạt động gần nhất
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full h-10 w-10 flex items-center justify-center">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {student.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                                Level {student.level}
                              </div>
                              <span className="text-sm text-gray-600">
                                {student.xp} XP
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-900">
                              {student.completedQuizzes}/{quizzes.length}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {student.averageScore}
                              </span>
                              <Trophy className="h-4 w-4 text-yellow-500" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {formatDate(student.lastActive)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === "quizzes" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Quản lý bài quiz ({quizzes.length})
                  </h3>
                  <button
                    onClick={() => navigate(`/classroom/${id}/quiz/create`)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tạo quiz mới</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {quizzes.map((quiz, index) => (
                    <div key={quiz.id}>
                      {index > 0 && (
                        <div className="border-t-4 border-gray-300 my-8"></div>
                      )}
                      <div
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 shadow-md"
                        style={{ border: "1px solid blue" }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                {quiz.title}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getQuizStatusColor(
                                  quiz.status
                                )}`}
                              >
                                {getQuizStatusText(quiz.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {quiz.description}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{quiz.questionCount} câu hỏi</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{quiz.timeLimit} phút</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {formatDateTime(quiz.startTime)} -{" "}
                                  {formatDateTime(quiz.endTime)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 ml-4">
                            <button
                              onClick={() =>
                                navigate(`/classroom/${id}/quiz/${quiz.id}`)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-blue-200 hover:border-blue-300"
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/classroom/${id}/quiz/${quiz.id}/edit`
                                )
                              }
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200 hover:border-gray-300"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200 hover:border-red-300"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {quiz.status === "completed" && (
                          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t-2 border-gray-200">
                            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 font-medium">
                                Số bài nộp
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {quiz.submissions}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-600 font-medium">
                                Điểm TB
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {quiz.averageScore}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm text-gray-600 font-medium">
                                Điểm cao nhất
                              </p>
                              <p className="text-lg font-bold text-green-600">
                                {quiz.maxScore}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-gray-600 font-medium">
                                Điểm thấp nhất
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                {quiz.minScore}
                              </p>
                            </div>
                          </div>
                        )}

                        {quiz.status === "active" && (
                          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t-2 border-gray-200">
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-600 font-medium">
                                Đã nộp bài
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {quiz.submissions}/{classroom.studentCount}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <p className="text-sm text-gray-600 font-medium">
                                Thời gian còn lại
                              </p>
                              <p className="text-lg font-bold text-orange-600">
                                Đang diễn ra
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {quizzes.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Chưa có bài quiz nào
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tạo bài quiz đầu tiên cho lớp học của bạn
                    </p>
                    <button
                      onClick={() => navigate(`/classroom/${id}/quiz/create`)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
                    >
                      Tạo quiz mới
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;
