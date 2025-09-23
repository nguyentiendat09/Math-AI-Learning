import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Star,
  Target,
  Award,
  TrendingUp,
  BookOpen,
  Clock,
  Edit,
  Save,
  X,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalXP: 0,
    completedTopics: 0,
    totalTopics: 0,
    currentStreak: 0,
    averageScore: 0,
    studyTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      // For demo accounts, use the user data from AuthContext
      if (user && user.email && user.email.includes("demo.com")) {
        setProfile({
          name: user.name,
          email: user.email,
          role: user.role,
          grade: user.grade,
          level: user.level || 1,
          xp: user.xp || 100,
        });
        setEditForm({
          name: user.name,
          email: user.email,
        });
        setLoading(false);
        return;
      }

      // Try to fetch from API for real accounts
      const response = await axios.get("/api/users/profile");
      setProfile(response.data);
      setEditForm({
        name: response.data.name,
        email: response.data.email,
      });
      setStats({
        totalXP: response.data.xp,
        completedTopics: response.data.completedTopics,
        totalTopics: response.data.totalTopics,
        currentStreak: 7, // Mock data
        averageScore: 85, // Mock data
        studyTime: 120, // Mock data in minutes
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = () => {
    // Mock achievements data
    setAchievements([
      {
        id: 1,
        title: "Người học tích cực",
        description: "Học 7 ngày liên tiếp",
        icon: "🔥",
        earned: true,
        earnedDate: "2024-09-15",
      },
      {
        id: 2,
        title: "Thách thức AI",
        description: "Hoàn thành 10 quiz AI",
        icon: "🤖",
        earned: true,
        earnedDate: "2024-09-10",
      },
      {
        id: 3,
        title: "Bậc thầy toán học",
        description: "Đạt 100% trong 5 chủ đề",
        icon: "🏆",
        earned: false,
        progress: 3,
      },
      {
        id: 4,
        title: "Khám phá tri thức",
        description: "Hoàn thành 20 chủ đề",
        icon: "📚",
        earned: false,
        progress: 12,
      },
    ]);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        name: profile.name,
        email: profile.email,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      // Mock API call - in real implementation, make PUT request to update profile
      const updatedProfile = { ...profile, ...editForm };
      setProfile(updatedProfile);
      updateUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const getProgressPercentage = () => {
    return stats.totalTopics > 0
      ? (stats.completedTopics / stats.totalTopics) * 100
      : 0;
  };

  const getLevelProgress = () => {
    const currentLevel = profile?.level || 1;
    const xpInCurrentLevel = (profile?.xp || 0) % 500;
    return (xpInCurrentLevel / 500) * 100;
  };

  const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>

              {/* Basic Info */}
              <div className="flex-1" style={{ marginLeft: "16px" }}>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="form-input text-xl font-bold"
                      placeholder="Họ và tên"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="form-input"
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mt-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>{profile?.email}</span>
                      </div>
                      <div
                        className="flex items-center"
                        style={{ marginLeft: "20px" }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Tham gia từ tháng 9, 2024</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Level Badge */}
                <div className="flex items-center space-x-3 mt-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all px-3 py-1 rounded-full text-sm font-semibold">
                    Level {profile?.level || 1}
                  </div>
                  <div className="text-blue-600 font-semibold ml-4">
                    {profile?.xp || 0} XP
                  </div>
                  {profile?.role === "teacher" && (
                    <div className="badge badge-primary ml-4">Giáo viên</div>
                  )}
                  {profile?.role === "student" && profile?.grade && (
                    <div className="badge badge-secondary ml-4">
                      Lớp {profile.grade}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-6 lg:mt-0">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-success inline-flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lưu
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="btn-secondary inline-flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="btn-primary inline-flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Stats */}
            <div className="card">
              <h2 className="card-title mb-6">Thống kê học tập</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.completedTopics}/{stats.totalTopics}
                  </div>
                  <div className="text-gray-600 mb-3">Chủ đề hoàn thành</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.averageScore}%
                  </div>
                  <div className="text-gray-600 mb-3">Điểm trung bình</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${stats.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* More Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalXP}
                </div>
                <div className="text-gray-600">Tổng XP</div>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.currentStreak}
                </div>
                <div className="text-gray-600">Ngày streak</div>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatStudyTime(stats.studyTime)}
                </div>
                <div className="text-gray-600">Thời gian học</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h2 className="card-title mb-6">Thành tích</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      achievement.earned
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            achievement.earned
                              ? "text-green-800"
                              : "text-gray-700"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            achievement.earned
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {achievement.description}
                        </p>
                        {achievement.earned ? (
                          <div className="text-xs text-green-500 mt-1">
                            Đạt được:{" "}
                            {new Date(
                              achievement.earnedDate
                            ).toLocaleDateString("vi-VN")}
                          </div>
                        ) : (
                          achievement.progress && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-600 mb-1">
                                Tiến độ: {achievement.progress}/
                                {achievement.title.includes("20") ? "20" : "5"}
                              </div>
                              <div className="progress-bar h-2">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${
                                      (achievement.progress /
                                        (achievement.title.includes("20")
                                          ? 20
                                          : 5)) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Tiến độ Level
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {profile?.level || 1}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {500 - ((profile?.xp || 0) % 500)} XP để đạt Level{" "}
                  {(profile?.level || 1) + 1}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Level {profile?.level || 1}</span>
                  <span>Level {(profile?.level || 1) + 1}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Hoàn thành "Số nguyên"
                    </div>
                    <div className="text-xs text-gray-600">2 giờ trước</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Đạt thành tích "Thách thức AI"
                    </div>
                    <div className="text-xs text-gray-600">1 ngày trước</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Lên Level 3
                    </div>
                    <div className="text-xs text-gray-600">3 ngày trước</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Streak */}
            <div className="card bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-4">
                🔥 Streak hiện tại
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.currentStreak}
                </div>
                <div className="text-orange-700 text-sm mb-4">
                  ngày liên tiếp
                </div>
                <div className="text-xs text-orange-600">
                  Hãy tiếp tục học để duy trì streak!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
