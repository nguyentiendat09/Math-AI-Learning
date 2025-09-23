import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Plus,
  Eye,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  BarChart3,
  School,
  Activity,
  Zap,
} from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 47,
    totalClasses: 2,
    activeQuizzes: 8,
    averageProgress: 78,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      student: "Nguyễn Văn An",
      action: "hoàn thành bài tập Phân số",
      time: "5 phút trước",
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 2,
      student: "Bài tập Quiz Hình học",
      action: "sắp hết hạn",
      time: "2 giờ trước",
      icon: Clock,
      color: "yellow",
    },
    {
      id: 3,
      student: "3 học sinh mới",
      action: "tham gia Lớp 6A",
      time: "1 ngày trước",
      icon: Users,
      color: "blue",
    },
  ]);

  const [activeClassrooms, setActiveClassrooms] = useState([
    {
      id: "MATH6A",
      name: "Lớp 6A - Toán Nâng Cao",
      students: 25,
      recentActivity: "5 học sinh hoạt động",
      progress: 85,
    },
    {
      id: "MATH7B",
      name: "Lớp 7B - Đại Số Cơ Bản",
      students: 22,
      recentActivity: "3 bài quiz đang diễn ra",
      progress: 72,
    },
  ]);

  const quickActions = [
    {
      title: "Tạo Lớp Học Mới",
      description: "Tạo và quản lý lớp học",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => navigate("/classroom-management"),
    },
    {
      title: "Tạo Quiz Mới",
      description: "Tạo bài kiểm tra cho học sinh",
      icon: BookOpen,
      color: "bg-green-600 hover:bg-green-700",
      action: () => navigate("/classroom-management"),
    },
    {
      title: "AI Generator",
      description: "Tạo nội dung với AI",
      icon: Zap,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => navigate("/ai-generator"),
    },
    {
      title: "Bản Đồ Học Tập",
      description: "Xem tiến độ học tập",
      icon: Target,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => navigate("/learning-map"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý lớp học và theo dõi tiến độ học sinh
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Chào mừng trở lại,</p>
                <p className="font-semibold text-gray-900">
                  {user?.name || "Giáo viên"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng học sinh
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lớp học</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalClasses}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <School className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Bài quiz đang hoạt động
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.activeQuizzes}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tiến độ trung bình
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.averageProgress}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-gradient-to-r from-blue-600 to-yellow-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex items-center justify-center mb-4">
                  <action.icon className="h-10 w-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-center">
                  {action.title}
                </h3>
                <p className="text-sm opacity-90 text-center">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Hoạt động gần đây
              </h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.color === "green"
                        ? "bg-green-100"
                        : activity.color === "yellow"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <activity.icon
                      className={`h-4 w-4 ${
                        activity.color === "green"
                          ? "text-green-600"
                          : activity.color === "yellow"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.student}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Classrooms */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Lớp học hoạt động
              </h2>
              <School className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {activeClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {classroom.name}
                    </h3>
                    <button
                      onClick={() => navigate(`/classroom/${classroom.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{classroom.students} học sinh</span>
                    <span>{classroom.progress}% tiến độ</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${classroom.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {classroom.recentActivity}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/classroom-management")}
              className="w-full mt-4 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
            >
              Xem tất cả lớp học
            </button>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Thống kê và báo cáo
            </h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Lịch dạy hôm nay</h3>
              <p className="text-sm text-gray-600">2 lớp học đang chờ</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">
                Thành tích nổi bật
              </h3>
              <p className="text-sm text-gray-600">5 học sinh xuất sắc</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Mục tiêu tháng</h3>
              <p className="text-sm text-gray-600">85% hoàn thành</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
