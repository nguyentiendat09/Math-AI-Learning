import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  Star,
  PlayCircle,
  Map,
  Zap,
  TrendingUp,
  Award,
  Brain,
  CheckCircle,
  Users,
  School,
} from "lucide-react";
import { getAllClassrooms } from "../data/classrooms";

const Dashboard = () => {
  const { user, joinedClassrooms, clearJoinedClassrooms } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    completedTopics: 0,
    totalTopics: 0,
    currentStreak: 7,
    totalXP: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTopics, setRecentTopics] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [topicsRes, progressRes] = await Promise.all([
        axios.get("/api/topics"),
        axios.get("/api/progress"),
      ]);

      setTopics(topicsRes.data);
      setProgress(progressRes.data);

      // Calculate stats
      const completedCount = progressRes.data.filter((p) => p.completed).length;
      const totalXP = user?.xp || 0;

      setStats({
        completedTopics: completedCount,
        totalTopics: topicsRes.data.length,
        currentStreak: 7, // Mock data
        totalXP,
      });

      // Get recent topics (last 3 accessed)
      const recent = topicsRes.data.slice(0, 3);
      setRecentTopics(recent);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicProgress = (topicId) => {
    const topicProgress = progress.find((p) => p.topicId === topicId);
    return topicProgress || { completed: false, score: 0 };
  };

  const getProgressPercentage = () => {
    return stats.totalTopics > 0
      ? (stats.completedTopics / stats.totalTopics) * 100
      : 0;
  };

  const getNextLevel = () => {
    const currentLevel = user?.level || 1;
    const xpNeeded = currentLevel * 500 - (user?.xp || 0);
    return { level: currentLevel + 1, xpNeeded: Math.max(0, xpNeeded) };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Sẵn sàng tiếp tục hành trình khám phá toán học?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-blue-100">Tiến độ</div>
                <div className="text-2xl font-bold">
                  {stats.completedTopics}/{stats.totalTopics}
                </div>
                <div className="text-sm text-blue-100">chủ đề hoàn thành</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-yellow-100">Level</div>
                <div className="text-2xl font-bold">{user?.level || 1}</div>
                <div className="text-sm text-yellow-100">
                  {getNextLevel().xpNeeded} XP để level tiếp
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-green-100">XP</div>
                <div className="text-2xl font-bold">{stats.totalXP}</div>
                <div className="text-sm text-green-100">điểm kinh nghiệm</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-purple-100">
                  Streak
                </div>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-sm text-purple-100">ngày liên tiếp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tiến độ tổng thể
            </h2>
            <span className="text-sm text-gray-600">
              {getProgressPercentage().toFixed(1)}% hoàn thành
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Bắt đầu</span>
            <span>Hoàn thành</span>
          </div>
        </div>

        {/* Joined Classrooms Section */}
        {joinedClassrooms.length > 0 && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title">Lớp học của tôi</h2>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinedClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="border border-green-200 bg-green-50 rounded-lg p-4 hover:border-green-300 transition-colors hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {classroom.name}
                    </h3>
                    <button
                      onClick={() => {
                        console.log(
                          "🎓 Navigating to joined classroom:",
                          classroom.id
                        );
                        navigate(`/my-classroom/${classroom.id}`);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Vào lớp
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{classroom.studentCount} học sinh</span>
                    </span>
                    <span>Lớp {classroom.grade}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Giáo viên: {classroom.teacher}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">
                      Mã: {classroom.code}
                    </span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                      Đã tham gia
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Classrooms Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="card-title">Lớp học có sẵn</h2>
            <School className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getAllClassrooms()
              .filter(
                (classroom) =>
                  !joinedClassrooms.some((joined) => joined.id === classroom.id)
              )
              .map((classroom) => {
                console.log(
                  "🎨 Dashboard rendering available classroom:",
                  classroom
                );
                return (
                  <div
                    key={classroom.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {classroom.name}
                      </h3>
                      <button
                        onClick={() => {
                          console.log("� Navigating to join classroom page");
                          navigate("/join-classroom");
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Tham gia
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{classroom.studentCount} học sinh</span>
                      </span>
                      <span>Lớp {classroom.grade}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Giáo viên: {classroom.teacher}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">
                        Mã: {classroom.code}
                      </span>
                      <span className="text-xs text-gray-500">
                        {classroom.quizCount} bài quiz
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h2 className="card-title mb-6">Hành động nhanh</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/learning-map"
                  className="group p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100"
                >
                  <Map className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-3 transition-all duration-300 group-hover:scale-110" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                    Bản đồ học tập
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                    Khám phá hành trình học tập trực quan
                  </p>
                </Link>

                <Link
                  to="/ai-generator"
                  className="group p-6 border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100"
                >
                  <Zap className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                    AI Generator
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                    Tạo bài tập và quiz với AI
                  </p>
                </Link>

                <Link
                  to="/leaderboard"
                  className="group p-6 border-2 border-dashed border-gray-300 hover:border-yellow-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-yellow-100"
                >
                  <Trophy className="h-8 w-8 text-gray-400 group-hover:text-yellow-500 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors duration-300">
                    Bảng xếp hạng
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-yellow-600 transition-colors duration-300">
                    Xem thứ hạng của bạn
                  </p>
                </Link>
              </div>
            </div>

            {/* Recent Topics */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title">Tiếp tục học</h2>
                <Link
                  to="/learning-map"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Xem tất cả →
                </Link>
              </div>
              <div className="space-y-4">
                {recentTopics.map((topic) => {
                  const topicProgress = getTopicProgress(topic.id);
                  return (
                    <Link
                      key={topic.id}
                      to={`/topic/${topic.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center  ${
                              topicProgress.completed
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {topicProgress.completed ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <BookOpen className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {topic.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {topic.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-primary">
                                {topic.level}
                              </span>
                              <span className="badge badge-warning">
                                {topic.xp} XP
                              </span>
                            </div>
                          </div>
                        </div>
                        <PlayCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Thành tích gần đây
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Người học tích cực
                    </div>
                    <div className="text-xs text-gray-600">
                      7 ngày học liên tiếp
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Thách thức AI
                    </div>
                    <div className="text-xs text-gray-600">
                      Hoàn thành 5 quiz AI
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Tiến bộ vượt bậc
                    </div>
                    <div className="text-xs text-gray-600">
                      Đạt Level {user?.level}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Level Progress */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Tiến độ Level
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  Level {user?.level || 1}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {getNextLevel().xpNeeded} XP để đạt Level{" "}
                  {getNextLevel().level}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                      width: `${Math.max(
                        0,
                        (((user?.xp || 0) % 500) / 500) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Level {user?.level || 1}</span>
                  <span>Level {getNextLevel().level}</span>
                </div>
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-4">
                Thử thách hôm nay
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">
                    Hoàn thành 1 chủ đề
                  </span>
                  <span className="text-xs text-purple-600">+50 XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Làm quiz AI</span>
                  <span className="text-xs text-purple-600">+30 XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">Học 30 phút</span>
                  <span className="text-xs text-purple-600">+20 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
