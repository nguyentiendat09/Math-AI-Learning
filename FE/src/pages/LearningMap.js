import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  MapPin,
  Lock,
  CheckCircle,
  PlayCircle,
  Star,
  Trophy,
  Zap,
  BookOpen,
  Target,
  Award,
  Search,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";

const LearningMap = () => {
  const { user, canAccessLevel } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'available', 'locked'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchMapData();
  }, []);

  // Listen for localStorage changes (when user creates new topic)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchMapData();
    };

    // Listen for custom storage events
    window.addEventListener("localStorageUpdated", handleStorageChange);

    // Also check when component comes back into focus
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageUpdated", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const fetchMapData = async () => {
    try {
      // First, try to get data from localStorage
      const localTopics = JSON.parse(localStorage.getItem("topics") || "[]");

      // Try to fetch from API (will fail and go to catch block)
      const [topicsRes, progressRes] = await Promise.all([
        axios.get("/api/topics"),
        axios.get("/api/progress"),
      ]);

      // If API succeeds, merge with localStorage data
      const apiTopics = topicsRes.data || [];
      const mergedTopics = [...apiTopics, ...localTopics];

      setTopics(mergedTopics);
      setProgress(progressRes.data || []);
    } catch (error) {
      console.error("Failed to fetch map data:", error);

      // Use localStorage data and mock data when API fails
      const localTopics = JSON.parse(localStorage.getItem("topics") || "[]");

      // Mock data for demo
      const mockTopics = [
        {
          id: 1,
          title: "Số nguyên",
          description: "Khám phá thế giới số âm và số dương",
          level: "Lớp 6",
          category: "Đại số",
          xp: 100,
          prerequisites: [],
        },
        {
          id: 2,
          title: "Phân số",
          description: "Hiểu về các phần của một tổng thể",
          level: "Lớp 6",
          category: "Đại số",
          xp: 120,
          prerequisites: [1],
        },
        {
          id: 3,
          title: "Định lý Pythagore",
          description: "Khám phá mối quan hệ giữa các cạnh tam giác vuông",
          level: "Lớp 8",
          category: "Hình học",
          xp: 150,
          prerequisites: [],
        },
        {
          id: 4,
          title: "Xác suất cơ bản",
          description: "Tính toán khả năng xảy ra của các sự kiện",
          level: "Lớp 7",
          category: "Thống kê",
          xp: 130,
          prerequisites: [2],
        },
        {
          id: 5,
          title: "Hệ phương trình bậc nhất",
          description: "Giải hệ phương trình với hai ẩn số",
          level: "Lớp 9",
          category: "Đại số",
          xp: 180,
          prerequisites: [],
        },
      ];

      // Merge localStorage topics with mock topics
      // If a topic exists in both localStorage and mock, prefer localStorage version
      const localTopicIds = localTopics.map((t) => t.id);
      const filteredMockTopics = mockTopics.filter(
        (mockTopic) => !localTopicIds.includes(mockTopic.id)
      );

      const allTopics = [...localTopics, ...filteredMockTopics];

      console.log("📋 Topics loaded:", {
        localStorage: localTopics.length,
        mock: filteredMockTopics.length,
        total: allTopics.length,
      });

      setTopics(allTopics);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const getTopicStatus = (topicId) => {
    const topicProgress = progress.find((p) => p.topicId === topicId);
    const topic = topics.find((t) => t.id === topicId);

    if (topicProgress && topicProgress.completed) {
      return "completed";
    }

    if (topic && topic.prerequisites.length === 0) {
      return "available";
    }

    const allPrereqsCompleted = topic?.prerequisites.every((prereqId) =>
      progress.some((p) => p.topicId === prereqId && p.completed)
    );

    return allPrereqsCompleted ? "available" : "locked";
  };

  // Helper function to check if a topic is grade-restricted
  const isGradeRestricted = (topic) => {
    return user?.role === "student" && !canAccessLevel(topic.level);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "available":
        return <PlayCircle className="h-6 w-6 text-blue-600" />;
      case "locked":
        return <Lock className="h-6 w-6 text-gray-400" />;
      default:
        return <MapPin className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 shadow-green-200";
      case "available":
        return "border-blue-500 bg-blue-50 shadow-blue-200";
      case "locked":
        return "border-gray-300 bg-gray-50 shadow-gray-200";
      default:
        return "border-gray-300 bg-white shadow-gray-200";
    }
  };

  const filteredTopics = topics.filter((topic) => {
    const status = getTopicStatus(topic.id);
    const matchesFilter = filter === "all" || status === filter;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || topic.category === selectedCategory;

    // Grade-based access control for students
    const hasGradeAccess = canAccessLevel(topic.level);

    return matchesFilter && matchesSearch && matchesCategory && hasGradeAccess;
  });

  const categories = ["all", ...new Set(topics.map((topic) => topic.category))];

  const getCompletionStats = () => {
    // For students, only count topics they can access (based on grade)
    const accessibleTopics =
      user?.role === "teacher"
        ? topics
        : topics.filter((topic) => canAccessLevel(topic.level));

    const completed = accessibleTopics.filter(
      (topic) => getTopicStatus(topic.id) === "completed"
    ).length;
    const available = accessibleTopics.filter(
      (topic) => getTopicStatus(topic.id) === "available"
    ).length;
    const locked = accessibleTopics.filter(
      (topic) => getTopicStatus(topic.id) === "locked"
    ).length;

    return { completed, available, locked, total: accessibleTopics.length };
  };

  const handleCreateNewTopic = () => {
    console.log("🎯 Navigating to CREATE new topic page");
    navigate("/topic/create");
  };

  const handleEditTopic = (topicId) => {
    console.log("🔧 Navigating to EDIT topic page for ID:", topicId);
    // Ensure topicId is treated as string for consistency
    navigate(`/topic/${topicId}/edit`);
  };

  const handleDeleteTopic = (topicId) => {
    console.log("🗑️ Deleting topic with ID:", topicId);

    // Check if this is a mock topic (ID 1-4)
    const mockTopicIds = [1, 2, 3, 4];
    const isMockTopic =
      mockTopicIds.includes(parseInt(topicId)) ||
      mockTopicIds.includes(topicId);

    if (isMockTopic) {
      alert("❌ Không thể xóa chủ đề mẫu từ hệ thống!");
      return;
    }

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa chủ đề này? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    try {
      // Get existing topics from localStorage
      const existingTopics = JSON.parse(localStorage.getItem("topics") || "[]");

      // Filter out the topic to delete (handle both string and number IDs)
      const filteredTopics = existingTopics.filter(
        (topic) => topic.id !== topicId && topic.id !== parseInt(topicId)
      );

      // Save back to localStorage
      localStorage.setItem("topics", JSON.stringify(filteredTopics));

      console.log("✅ Topic deleted from localStorage");

      // Trigger event to refresh the map
      const customEvent = new CustomEvent("localStorageUpdated", {
        detail: { action: "topic_deleted", topicId },
      });
      window.dispatchEvent(customEvent);

      alert("✅ Xóa chủ đề thành công!");

      // Refresh the page data
      fetchMapData();
    } catch (error) {
      console.error("❌ Error deleting topic:", error);
      alert("Có lỗi xảy ra khi xóa chủ đề!");
    }
  };

  const stats = getCompletionStats();

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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bản đồ học tập
          </h1>
          <p className="text-gray-600">Khám phá hành trình toán học của bạn</p>
        </div>

        {/* Stats Overview - Only show for students */}
        {user.role !== "teacher" && (
          <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
            <div className="card text-center p-3 sm:p-4 md:p-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {stats.completed}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">
                Hoàn thành
              </div>
            </div>

            <div className="card text-center p-3 sm:p-4 md:p-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {stats.available}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">
                Có thể học
              </div>
            </div>

            <div className="card text-center p-3 sm:p-4 md:p-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-600" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {stats.locked}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">
                Chưa mở khóa
              </div>
            </div>

            <div className="card text-center p-3 sm:p-4 md:p-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                %
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">
                Tiến độ
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar - Only show for students */}
        {user.role !== "teacher" && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Tiến độ tổng thể
              </h2>
              <span className="text-sm text-gray-600">
                {stats.completed}/{stats.total} chủ đề
              </span>
            </div>
            <div className="progress-bar h-4">
              <div
                className="progress-fill bg-gradient-to-r from-green-500 to-blue-500"
                style={{
                  width: `${
                    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4">
            {/* Left side: Search and Filters - 80% width */}
            <div className="flex-1" style={{ width: "80%" }}>
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    className="absolute -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10 logoMargin"
                    style={{ marginLeft: "12px" }}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10 w-full"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select w-full lg:w-auto"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "Tất cả danh mục" : category}
                    </option>
                  ))}
                </select>

                {/* Status Filter - Only show for students */}
                {user.role !== "teacher" && (
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="form-select w-full lg:w-auto"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="available">Có thể học</option>
                    <option value="locked">Chưa mở khóa</option>
                  </select>
                )}
              </div>
            </div>

            {/* Right side: Add New Topic Button - 20% width */}
            {user.role === "teacher" && (
              <div style={{ width: "20%" }} className="flex justify-end">
                <button
                  onClick={handleCreateNewTopic}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 font-medium cursor-pointer w-full h-12 justify-center cursor-pointer"
                  style={{
                    height: "95px",
                    marginLeft: "20px",
                    fontSize: "16px",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm chủ đề mới</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const status = getTopicStatus(topic.id);
            const topicProgress = progress.find((p) => p.topicId === topic.id);
            const gradeRestricted = isGradeRestricted(topic);
            // For teachers, all topics are unlocked
            const isLocked =
              user?.role === "teacher"
                ? false
                : status === "locked" || gradeRestricted;

            return (
              <div
                key={topic.id}
                className={`card relative overflow-hidden transition-all duration-300 min-h-[400px] flex flex-col ${getStatusColor(
                  status
                )} ${
                  !isLocked
                    ? "hover:shadow-lg hover:-translate-y-1"
                    : "opacity-75"
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {getStatusIcon(status)}
                </div>

                {/* Difficulty Level */}
                <div className="absolute top-4 left-4">
                  <span
                    className="badge badge-primary text-xs"
                    style={{ marginLeft: "275px" }}
                  >
                    {topic.level}
                  </span>
                </div>

                <div className="pt-8 flex-1 flex flex-col">
                  {/* Topic Icon/Visual */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>

                  {/* Topic Info - Flex grow to fill space */}
                  <div className="text-center mb-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3 min-h-[4rem]">
                        {topic.description}
                      </p>

                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Award className="h-3 w-3 mr-1" />
                          <span>{topic.xp} XP</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          <span>{topic.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress for completed topics */}
                    {topicProgress && status === "completed" && (
                      <div className="mt-3 p-2 bg-green-100 rounded-lg">
                        <div className="text-sm font-semibold text-green-800">
                          Điểm: {topicProgress.score}%
                        </div>
                        <div className="text-xs text-green-600">
                          Hoàn thành ngày{" "}
                          {new Date(topicProgress.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    )}

                    {/* Prerequisites info for locked topics */}
                    {isLocked &&
                      topic.prerequisites.length > 0 &&
                      !gradeRestricted && (
                        <div className="mt-3 p-2 bg-gray-100 rounded-lg">
                          <div className="text-xs text-gray-600">
                            Cần hoàn thành:{" "}
                            {topic.prerequisites
                              .map((prereqId) => {
                                const prereqTopic = topics.find(
                                  (t) => t.id === prereqId
                                );
                                return prereqTopic?.title;
                              })
                              .join(", ")}
                          </div>
                        </div>
                      )}

                    {/* Grade restriction info */}
                    {gradeRestricted && (
                      <div className="mt-3 p-2 bg-red-100 rounded-lg">
                        <div className="text-xs text-red-600 flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          Chỉ dành cho học sinh {topic.level}
                        </div>
                        {user?.grade && (
                          <div className="text-xs text-red-500 mt-1">
                            Bạn đang ở lớp {user.grade}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="text-center space-y-2">
                    {isLocked ? (
                      <button
                        className="btn-secondary opacity-50 cursor-not-allowed w-full"
                        disabled
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {gradeRestricted ? "Không đủ cấp độ" : "Chưa mở khóa"}
                      </button>
                    ) : (
                      <>
                        <Link
                          to={`/topic/${topic.id}`}
                          className={`${
                            status === "completed"
                              ? "btn-success"
                              : "btn-primary"
                          } inline-flex items-center justify-center w-full`}
                        >
                          {status === "completed" ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Ôn tập
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Bắt đầu học
                            </>
                          )}
                        </Link>

                        {/* Edit and Delete buttons for teachers */}
                        {user?.role === "teacher" && (
                          <div className="flex gap-2 mt-6 ">
                            <button
                              onClick={() => handleEditTopic(topic.id)}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg inline-flex items-center justify-center flex-1 cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={() => handleDeleteTopic(topic.id)}
                              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg inline-flex items-center justify-center flex-1 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Completion Effect */}
                {status === "completed" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy chủ đề nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Achievement Encouragement */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tiếp tục hành trình học tập!
          </h3>
          <p className="text-gray-600 mb-4">
            {stats.completed === 0
              ? "Hãy bắt đầu với chủ đề đầu tiên để mở khóa những kiến thức mới!"
              : stats.available > 0
              ? `Bạn có ${stats.available} chủ đề có thể học tiếp. Hãy tiếp tục!`
              : "Tuyệt vời! Bạn đã hoàn thành tất cả chủ đề hiện có."}
          </p>
          {stats.available > 0 && (
            <Link
              to={`/topic/${
                filteredTopics.find((t) => getTopicStatus(t.id) === "available")
                  ?.id
              }`}
              className="btn-primary"
            >
              <Zap className="h-4 w-4 mr-2" />
              Học ngay
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningMap;
