import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Trophy,
  Clock,
  Calendar,
  User,
  Play,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import { getClassroomById } from "../data/classrooms";

const StudentClassroomView = () => {
  const { id } = useParams();
  const { user, getJoinedClassroom, hasJoinedClassroom } = useAuth();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [myProgress, setMyProgress] = useState(null);
  const [activeTab, setActiveTab] = useState("assignments");

  const loadClassroomData = useCallback(() => {
    console.log("🔍 StudentClassroomView - ID from URL:", id, typeof id);
    console.log("🔍 Current URL:", window.location.href);

    // Check if user has joined this classroom
    const hasJoined = hasJoinedClassroom(parseInt(id));
    console.log("🔒 Has joined classroom:", hasJoined);

    if (!hasJoined) {
      console.log(
        "❌ User has not joined this classroom, redirecting to join page"
      );
      navigate("/join-classroom");
      return;
    }

    // Get classroom data from shared data source
    const sharedClassroom = getClassroomById(id);
    console.log("📚 Shared classroom found:", sharedClassroom);

    // Get joined classroom data from session
    const joinedClassroom = getJoinedClassroom(id);
    console.log("💾 Joined classroom from storage:", joinedClassroom);

    // Use shared data as primary source
    let mockClassroom = sharedClassroom || joinedClassroom;

    if (!mockClassroom) {
      console.log("❌ No classroom found");
      navigate("/join-classroom");
      return;
    }

    console.log("✅ Final classroom used:", mockClassroom);
    console.log(
      "🏷️ Expected:",
      id === "2" ? "MATH8B - Toán học lớp 8B" : "MATH7A - Toán học lớp 7A"
    );
    console.log("🎯 Actual:", mockClassroom.code, "-", mockClassroom.name);

    // Mock classmates data - empty for new classrooms, sample for demo classrooms
    const mockClassmates =
      mockClassroom.studentCount > 0
        ? [
            {
              id: 1,
              name: "Nguyễn Văn An",
              level: 4,
              xp: 1850,
              rank: 1,
              avatar: null,
            },
            {
              id: 2,
              name: "Trần Thị Bình",
              level: 5,
              xp: 2100,
              rank: 2,
              avatar: null,
            },
            {
              id: 3,
              name: "Lê Văn Cường",
              level: 3,
              xp: 1200,
              rank: 3,
              avatar: null,
            },
          ]
        : []; // Empty array for new classrooms

    // Mock assignments data - empty for new classrooms, sample for demo classrooms
    const mockAssignments =
      mockClassroom.quizCount > 0
        ? [
            {
              id: 1,
              title: "Bài kiểm tra số học",
              description: "Kiểm tra kiến thức về số học cơ bản",
              type: "quiz",
              dueDate: "2024-09-25T23:59:59",
              status: "available", // available, completed, overdue, upcoming
              score: null,
              maxScore: 100,
              timeLimit: 30,
              questionCount: 10,
              submittedAt: null,
            },
            {
              id: 2,
              title: "Phép tính phân số",
              description: "Bài tập về phép cộng, trừ, nhân, chia phân số",
              type: "quiz",
              dueDate: "2024-09-22T23:59:59",
              status: "completed",
              score: 85,
              maxScore: 100,
              timeLimit: 45,
              questionCount: 15,
              submittedAt: "2024-09-20T14:30:00",
            },
            {
              id: 3,
              title: "Hình học cơ bản",
              description: "Tính diện tích và chu vi các hình cơ bản",
              type: "quiz",
              dueDate: "2024-09-30T23:59:59",
              status: "upcoming",
              score: null,
              maxScore: 100,
              timeLimit: 40,
              questionCount: 12,
              submittedAt: null,
            },
          ]
        : []; // Empty array for new classrooms

    // Calculate real progress data based on actual assignments
    const completedAssignments = mockAssignments.filter(
      (a) => a.status === "completed"
    );
    const totalAssignments = mockAssignments.length;

    // Calculate average score only from completed assignments
    let averageScore = null;
    if (completedAssignments.length > 0) {
      const totalScore = completedAssignments.reduce(
        (sum, assignment) => sum + (assignment.score || 0),
        0
      );
      averageScore = Math.round(totalScore / completedAssignments.length);
    }

    // Mock progress data based on real calculations
    const mockProgress = {
      totalXP: user?.xp || (completedAssignments.length > 0 ? 1850 : 0),
      level: user?.level || (completedAssignments.length > 0 ? 4 : 1),
      rank: mockClassmates.length > 0 ? 3 : null,
      completedAssignments: completedAssignments.length,
      totalAssignments: totalAssignments,
      averageScore: averageScore, // Will be null if no completed assignments
      streak: completedAssignments.length > 0 ? 5 : 0,
    };

    setClassroom(mockClassroom);
    setClassmates(mockClassmates);
    setAssignments(mockAssignments);
    setMyProgress(mockProgress);
  }, [
    id,
    user?.level,
    user?.xp,
    getJoinedClassroom,
    hasJoinedClassroom,
    navigate,
  ]);

  useEffect(() => {
    if (user?.role !== "student") {
      navigate("/");
      return;
    }

    // Check if student has joined this classroom
    const joinedClassroom = getJoinedClassroom(id);
    if (!joinedClassroom) {
      // Redirect to join classroom if not joined
      navigate("/join-classroom");
      return;
    }

    loadClassroomData();
  }, [id, user, navigate, getJoinedClassroom, loadClassroomData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Có thể làm";
      case "completed":
        return "Đã hoàn thành";
      case "overdue":
        return "Quá hạn";
      case "upcoming":
        return "Sắp mở";
      default:
        return "Chưa xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;

    if (diff < 0) return "Đã quá hạn";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return "Sắp hết hạn";
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-100";
      case 2:
        return "text-gray-600 bg-gray-100";
      case 3:
        return "text-orange-600 bg-orange-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4" />;
      case 2:
        return <Award className="h-4 w-4" />;
      case 3:
        return <Star className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
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
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {classroom.name}
                </h1>
                <p className="text-gray-600">
                  {classroom.teacher} • {classroom.studentCount} học sinh
                </p>
              </div>
            </div>

            {/* My Progress Summary */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Level {myProgress?.level}
                  </div>
                  <span className="text-sm text-gray-600">
                    {myProgress?.totalXP} XP
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Hạng {myProgress?.rank}/{classroom.studentCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs lg:text-sm font-medium">
                  Điểm TB
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {myProgress?.averageScore !== null
                    ? myProgress.averageScore
                    : "--"}
                </p>
              </div>
              <Trophy className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs lg:text-sm font-medium">
                  Bài đã làm
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {myProgress?.completedAssignments}/
                  {myProgress?.totalAssignments}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs lg:text-sm font-medium">
                  Hạng trong lớp
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  #{myProgress?.rank}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs lg:text-sm font-medium">
                  Streak
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {myProgress?.streak} ngày
                </p>
              </div>
              <Star className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6">
            <nav className="flex space-x-2 bg-gray-100 rounded-xl p-2">
              <button
                onClick={() => setActiveTab("assignments")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all ${
                  activeTab === "assignments"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Bài tập</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("classmates")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all ${
                  activeTab === "classmates"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Bạn cùng lớp</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="px-6 pb-6">
            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Bài tập từ giáo viên ({assignments.length})
                  </h3>
                </div>

                <div className="grid gap-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">
                              {assignment.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
                                assignment.status
                              )}`}
                            >
                              {getStatusIcon(assignment.status)}
                              <span>{getStatusText(assignment.status)}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {assignment.description}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{assignment.questionCount} câu hỏi</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{assignment.timeLimit} phút</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatTimeRemaining(assignment.dueDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {assignment.status === "completed" && (
                            <div>
                              <div className="text-2xl font-bold text-green-600">
                                {assignment.score}/{assignment.maxScore}
                              </div>
                              <p className="text-xs text-gray-500">
                                Nộp: {formatDateTime(assignment.submittedAt)}
                              </p>
                            </div>
                          )}
                          {assignment.status === "available" && (
                            <button
                              onClick={() => navigate(`/quiz/${assignment.id}`)}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
                            >
                              Làm bài
                            </button>
                          )}
                          {assignment.status === "upcoming" && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Sắp mở</p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(assignment.dueDate)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {assignments.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Chưa có bài tập nào
                    </h3>
                    <p className="text-gray-600">
                      Giáo viên chưa giao bài tập cho lớp
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Classmates Tab */}
            {activeTab === "classmates" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Bảng xếp hạng lớp ({classmates.length} học sinh)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Hạng
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Học sinh
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Level
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Điểm kinh nghiệm
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classmates.map((classmate) => (
                        <tr
                          key={classmate.id}
                          className={`border-b border-gray-100 transition-colors ${
                            classmate.name === user?.name
                              ? "bg-blue-50 hover:bg-blue-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div
                              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-bold ${getRankColor(
                                classmate.rank
                              )}`}
                            >
                              {getRankIcon(classmate.rank)}
                              <span>#{classmate.rank}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full h-10 w-10 flex items-center justify-center">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {classmate.name}
                                  {classmate.name === user?.name && (
                                    <span className="text-blue-600 text-sm ml-2">
                                      (Bạn)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-bold inline-block">
                              Level {classmate.level}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-lg font-bold text-gray-900">
                              {classmate.xp.toLocaleString()} XP
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentClassroomView;
