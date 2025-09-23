import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Save,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  History,
  Lightbulb,
  Eye,
  Upload,
  X,
  Check,
  CheckCircle,
  Target,
} from "lucide-react";

const TopicCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("🎯 TopicCreate component loaded");

  // State cho topic mới
  const [topic, setTopic] = useState({
    title: "",
    description: "",
    level: "Lớp 6",
    category: "Đại số",
    xp: 100,
    prerequisites: [],
  });

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);

  // State cho videos
  const [videos, setVideos] = useState([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    url: "",
    description: "",
    file: null,
    uploadType: "url",
  });
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  // State cho quizzes
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });
  const [editingQuiz, setEditingQuiz] = useState(null);

  // State cho content
  const [content, setContent] = useState({
    knowledge: "",
    history: "",
    application: "",
  });

  // State cho preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // State cho available topics để làm prerequisites
  const [availableTopics, setAvailableTopics] = useState([]);

  // Fetch available topics for prerequisites
  useEffect(() => {
    const fetchTopics = () => {
      try {
        // Get topics from localStorage
        const localTopics = JSON.parse(localStorage.getItem("topics") || "[]");

        // Mock topics data (same as in LearningMap)
        const mockTopics = [
          {
            id: 1,
            title: "Số nguyên",
            level: "Lớp 6",
          },
          {
            id: 2,
            title: "Phân số",
            level: "Lớp 6",
          },
          {
            id: 3,
            title: "Định lý Pythagore",
            level: "Lớp 8",
          },
          {
            id: 4,
            title: "Xác suất cơ bản",
            level: "Lớp 7",
          },
          {
            id: 5,
            title: "Hệ phương trình bậc nhất",
            level: "Lớp 9",
          },
        ];

        // Combine and filter out duplicates
        const allTopics = [...mockTopics, ...localTopics];
        const uniqueTopics = allTopics.filter(
          (topic, index, self) =>
            index === self.findIndex((t) => t.id === topic.id)
        );

        setAvailableTopics(uniqueTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setAvailableTopics([]);
      }
    };

    fetchTopics();
  }, []);

  // Effect to notify when prerequisites are auto-removed due to level change
  useEffect(() => {
    if (topic.level && availableTopics.length > 0) {
      const invalidPrereqs = topic.prerequisites.filter((prereqId) => {
        const prereqTopic = availableTopics.find((t) => t.id === prereqId);
        if (!prereqTopic) return false;
        // Prerequisites must be same level as current topic
        return prereqTopic.level !== topic.level;
      });

      if (invalidPrereqs.length > 0) {
        console.log(
          "Auto-removing prerequisites from different levels due to level change"
        );
      }
    }
  }, [topic.level, topic.prerequisites, availableTopics]);

  // Check teacher role
  useEffect(() => {
    if (user?.role !== "teacher") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  // ===== MAIN CREATE FUNCTION =====
  const handleCreateTopic = () => {
    console.log("🚀 === CREATING NEW TOPIC ===");

    // Validation
    if (!topic?.title?.trim()) {
      alert("❌ Vui lòng nhập tên chủ đề!");
      return;
    }

    if (!topic?.description?.trim()) {
      alert("❌ Vui lòng nhập mô tả chủ đề!");
      return;
    }

    setLoading(true);

    try {
      // Tạo topic object hoàn chỉnh
      const newTopic = {
        id: Date.now(), // Unique ID
        title: topic.title.trim(),
        description: topic.description.trim(),
        level: topic.level,
        category: topic.category,
        xp: parseInt(topic.xp) || 100,
        prerequisites: topic.prerequisites || [],
        videos: Array.isArray(videos) ? videos : [],
        quizzes: Array.isArray(quizzes) ? quizzes : [],
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isUnlocked: true,
        createdBy: user?.id || "teacher",
      };

      console.log("📝 New topic data:", newTopic);

      // Lấy topics hiện có từ localStorage
      const existingTopics = JSON.parse(localStorage.getItem("topics") || "[]");
      console.log("📋 Existing topics:", existingTopics.length);

      // Thêm topic mới
      existingTopics.push(newTopic);

      // Lưu vào localStorage
      localStorage.setItem("topics", JSON.stringify(existingTopics));
      console.log("💾 Topic saved to localStorage");

      // Trigger event cho LearningMap
      const customEvent = new CustomEvent("localStorageUpdated", {
        detail: {
          action: "topic_created",
          topic: newTopic,
        },
      });
      window.dispatchEvent(customEvent);
      console.log("📡 Event dispatched to LearningMap");

      // Thông báo thành công
      alert("🎉 Tạo chủ đề mới thành công!");

      // Chuyển về learning map
      navigate("/learning-map");
    } catch (error) {
      console.error("❌ Error creating topic:", error);
      alert("Có lỗi xảy ra khi tạo chủ đề!");
    } finally {
      setLoading(false);
    }
  };

  // ===== VIDEO FUNCTIONS =====
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const videoData = { ...videoForm };

      if (videoForm.uploadType === "file" && videoForm.file) {
        // Lưu file object để dùng URL.createObjectURL
        videoData.file = videoForm.file;
        videoData.url = null; // Không dùng URL string
      }

      if (editingVideo) {
        // Update video
        const updatedVideos = videos.map((video) =>
          video.id === editingVideo.id
            ? { ...editingVideo, ...videoData }
            : video
        );
        setVideos(updatedVideos);
      } else {
        // Add new video
        const newVideo = {
          id: Date.now(),
          ...videoData,
        };
        setVideos([...videos, newVideo]);
      }
      resetVideoForm();
      alert(editingVideo ? "Video đã được cập nhật" : "Video đã được thêm");
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Có lỗi xảy ra khi lưu video");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa video này?")) {
      setVideos(videos.filter((video) => video.id !== videoId));
      alert("Video đã được xóa");
    }
  };

  const resetVideoForm = () => {
    setVideoForm({
      title: "",
      url: "",
      description: "",
      file: null,
      uploadType: "url",
    });
    setEditingVideo(null);
    setShowVideoForm(false);
    setUploading(false);
  };

  // ===== QUIZ FUNCTIONS =====
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        // Update quiz
        const updatedQuizzes = quizzes.map((quiz) =>
          quiz.id === editingQuiz.id ? { ...editingQuiz, ...quizForm } : quiz
        );
        setQuizzes(updatedQuizzes);
      } else {
        // Add new quiz
        const newQuiz = {
          id: Date.now(),
          ...quizForm,
        };
        setQuizzes([...quizzes, newQuiz]);
      }
      resetQuizForm();
      alert(editingQuiz ? "Câu hỏi đã được cập nhật" : "Câu hỏi đã được thêm");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Có lỗi xảy ra khi lưu câu hỏi");
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
      alert("Câu hỏi đã được xóa");
    }
  };

  const resetQuizForm = () => {
    setQuizForm({
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });
    setEditingQuiz(null);
    setShowQuizForm(false);
  };

  // ===== CONTENT FUNCTIONS =====
  const handleContentSave = async (section) => {
    try {
      alert(`Nội dung ${section} đã được lưu tạm thời`);
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Có lỗi xảy ra khi lưu nội dung");
    }
  };

  const tabs = [
    { key: "info", label: "Thông tin chủ đề", icon: Target },
    { key: "videos", label: "Video", icon: Video },
    { key: "quizzes", label: "Quiz", icon: HelpCircle },
    { key: "knowledge", label: "Kiến thức", icon: FileText },
    { key: "history", label: "Lịch sử", icon: History },
    { key: "application", label: "Ứng dụng", icon: Lightbulb },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Đang tạo chủ đề mới...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/learning-map")}
              className="btn-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎯 Tạo chủ đề mới
              </h1>
              <p className="text-gray-600 mt-1">
                Tạo chủ đề học tập mới cho học sinh
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all text-white px-6 py-2.5 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer flex items-center h-12"
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </button>
          </div>
        </div>

        {/* Tab Navigation - Dashboard Style */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-blue-500 text-white border border-blue-600 rounded-lg shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-transparent rounded-lg"
                  }`}
                  style={
                    activeTab === tab.key
                      ? {
                          background:
                            "linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)",
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                        }
                      : {}
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Thông tin chủ đề</h2>
                <button
                  onClick={() => {
                    if (!topic?.title?.trim()) {
                      alert("Vui lòng nhập tên chủ đề!");
                      return;
                    }
                    alert("Thông tin đã được lưu tạm thời!");
                  }}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thông tin
                </button>
              </div>

              {/* Topic Info Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên chủ đề *
                    </label>
                    <input
                      type="text"
                      value={topic?.title || ""}
                      onChange={(e) =>
                        setTopic((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="form-input w-full"
                      placeholder="Nhập tên chủ đề"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả *
                    </label>
                    <textarea
                      value={topic?.description || ""}
                      onChange={(e) =>
                        setTopic((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="form-textarea w-full"
                      rows="4"
                      placeholder="Nhập mô tả chủ đề"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lớp học
                    </label>
                    <select
                      value={topic?.level || "Lớp 6"}
                      onChange={(e) => {
                        const newLevel = e.target.value;

                        setTopic((prev) => {
                          // Filter out prerequisites that are NOT the same level as new level
                          const validPrerequisites = prev.prerequisites.filter(
                            (prereqId) => {
                              const prereqTopic = availableTopics.find(
                                (t) => t.id === prereqId
                              );
                              if (!prereqTopic) return false;

                              return prereqTopic.level === newLevel;
                            }
                          );

                          return {
                            ...prev,
                            level: newLevel,
                            prerequisites: validPrerequisites,
                          };
                        });
                      }}
                      className="form-select w-full"
                    >
                      <option value="Lớp 6">Lớp 6</option>
                      <option value="Lớp 7">Lớp 7</option>
                      <option value="Lớp 8">Lớp 8</option>
                      <option value="Lớp 9">Lớp 9</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={topic?.category || "Đại số"}
                      onChange={(e) =>
                        setTopic((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="form-select w-full"
                    >
                      <option value="Đại số">Đại số</option>
                      <option value="Hình học">Hình học</option>
                      <option value="Số học">Số học</option>
                      <option value="Thống kê">Thống kê</option>
                      <option value="Giải tích">Giải tích</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm kinh nghiệm (XP)
                    </label>
                    <input
                      type="number"
                      value={topic?.xp || 100}
                      onChange={(e) =>
                        setTopic((prev) => ({
                          ...prev,
                          xp: parseInt(e.target.value) || 100,
                        }))
                      }
                      className="form-input w-full"
                      placeholder="Nhập điểm XP (50-500)"
                      min="50"
                      max="500"
                      step="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu tiên quyết
                    </label>
                    <div className="space-y-3">
                      {/* Current selected prerequisites */}
                      {topic.prerequisites &&
                        topic.prerequisites.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-600">
                              Chủ đề tiên quyết đã chọn:
                            </p>
                            {topic.prerequisites.map((prereqId) => {
                              const prereqTopic = availableTopics.find(
                                (t) => t.id === prereqId
                              );
                              return prereqTopic ? (
                                <div
                                  key={prereqId}
                                  className="flex items-center justify-between bg-blue-50 p-2 rounded-lg"
                                >
                                  <span className="text-sm text-blue-800">
                                    {prereqTopic.title} ({prereqTopic.level})
                                  </span>
                                  <button
                                    onClick={() => {
                                      setTopic((prev) => ({
                                        ...prev,
                                        prerequisites:
                                          prev.prerequisites.filter(
                                            (id) => id !== prereqId
                                          ),
                                      }));
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}

                      {/* Add prerequisite dropdown */}
                      <div>
                        <select
                          onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            if (
                              selectedId &&
                              !topic.prerequisites.includes(selectedId)
                            ) {
                              setTopic((prev) => ({
                                ...prev,
                                prerequisites: [
                                  ...prev.prerequisites,
                                  selectedId,
                                ],
                              }));
                            }
                            e.target.value = ""; // Reset selection
                          }}
                          className="form-select w-full"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Chọn chủ đề tiên quyết (tùy chọn)
                          </option>
                          {availableTopics
                            .filter((t) => {
                              // Filter out already selected prerequisites
                              if (topic.prerequisites.includes(t.id))
                                return false;

                              // Only show topics of the SAME level
                              return t.level === topic.level;
                            })
                            .map((availableTopic) => (
                              <option
                                key={availableTopic.id}
                                value={availableTopic.id}
                              >
                                {availableTopic.title} ({availableTopic.level})
                              </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Chỉ hiển thị chủ đề cùng {topic.level}. Học sinh phải
                          hoàn thành các chủ đề tiên quyết trước khi có thể học
                          chủ đề này.
                        </p>
                      </div>

                      {/* No prerequisites option */}
                      {topic.prerequisites.length === 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-700">
                            ✅ Chủ đề này sẽ mở khóa ngay lập tức cho học sinh
                            (không có yêu cầu tiên quyết)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video Tab */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Video bài học</h2>
                <button
                  onClick={() => setShowVideoForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm video
                </button>
              </div>

              {/* Video List */}
              <div className="space-y-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {video.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          URL: {video.url}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingVideo(video);
                            setVideoForm(video);
                            setShowVideoForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {videos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có video nào được thêm</p>
                  </div>
                )}
              </div>

              {/* Video Form Modal */}
              {showVideoForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingVideo ? "Chỉnh sửa video" : "Thêm video mới"}
                      </h3>
                      <button
                        onClick={resetVideoForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên video *
                        </label>
                        <input
                          type="text"
                          value={videoForm.title}
                          onChange={(e) =>
                            setVideoForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="form-input w-full"
                          placeholder="Nhập tên video"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mô tả
                        </label>
                        <textarea
                          value={videoForm.description}
                          onChange={(e) =>
                            setVideoForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="form-textarea w-full"
                          rows="3"
                          placeholder="Nhập mô tả video"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loại upload
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="url"
                              checked={videoForm.uploadType === "url"}
                              onChange={(e) =>
                                setVideoForm((prev) => ({
                                  ...prev,
                                  uploadType: e.target.value,
                                }))
                              }
                              className="form-radio"
                            />
                            <span className="ml-2">URL</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="file"
                              checked={videoForm.uploadType === "file"}
                              onChange={(e) =>
                                setVideoForm((prev) => ({
                                  ...prev,
                                  uploadType: e.target.value,
                                }))
                              }
                              className="form-radio"
                            />
                            <span className="ml-2">File</span>
                          </label>
                        </div>
                      </div>

                      {videoForm.uploadType === "url" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL video *
                          </label>
                          <input
                            type="url"
                            value={videoForm.url}
                            onChange={(e) =>
                              setVideoForm((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                            className="form-input w-full"
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn file video *
                          </label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              setVideoForm((prev) => ({
                                ...prev,
                                file: e.target.files[0],
                              }))
                            }
                            className="form-input w-full"
                            required
                          />
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={resetVideoForm}
                          className="btn-secondary"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={uploading}
                          className="btn-primary"
                        >
                          {uploading ? (
                            <>
                              <Upload className="h-4 w-4 mr-2 animate-spin" />
                              Đang upload...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              {editingVideo ? "Cập nhật" : "Thêm video"}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quizzes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Câu hỏi ôn tập</h2>
                <button
                  onClick={() => setShowQuizForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm câu hỏi
                </button>
              </div>

              {/* Quiz List */}
              <div className="space-y-4">
                {quizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {index + 1}. {quiz.question}
                        </h3>
                        <div className="mt-2 space-y-1">
                          {quiz.answers.map((answer, answerIndex) => (
                            <div
                              key={answerIndex}
                              className={`text-sm p-2 rounded ${
                                answerIndex === quiz.correctAnswer
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-50 text-gray-700"
                              }`}
                            >
                              {String.fromCharCode(65 + answerIndex)}. {answer}
                            </div>
                          ))}
                        </div>
                        {quiz.explanation && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Giải thích:</strong> {quiz.explanation}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setQuizForm(quiz);
                            setShowQuizForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {quizzes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Chưa có câu hỏi nào được thêm</p>
                  </div>
                )}
              </div>

              {/* Quiz Form Modal */}
              {showQuizForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingQuiz ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
                      </h3>
                      <button
                        onClick={resetQuizForm}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleQuizSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Câu hỏi *
                        </label>
                        <textarea
                          value={quizForm.question}
                          onChange={(e) =>
                            setQuizForm((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          className="form-textarea w-full"
                          rows="3"
                          placeholder="Nhập câu hỏi"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Các đáp án
                        </label>
                        {quizForm.answers.map((answer, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={quizForm.correctAnswer === index}
                              onChange={() =>
                                setQuizForm((prev) => ({
                                  ...prev,
                                  correctAnswer: index,
                                }))
                              }
                              className="form-radio"
                            />
                            <span className="text-sm font-medium w-6">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                              type="text"
                              value={answer}
                              onChange={(e) => {
                                const newAnswers = [...quizForm.answers];
                                newAnswers[index] = e.target.value;
                                setQuizForm((prev) => ({
                                  ...prev,
                                  answers: newAnswers,
                                }));
                              }}
                              className="form-input flex-1"
                              placeholder={`Đáp án ${String.fromCharCode(
                                65 + index
                              )}`}
                              required
                            />
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-2">
                          Chọn đáp án đúng bằng cách click vào radio button
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giải thích (tuỳ chọn)
                        </label>
                        <textarea
                          value={quizForm.explanation}
                          onChange={(e) =>
                            setQuizForm((prev) => ({
                              ...prev,
                              explanation: e.target.value,
                            }))
                          }
                          className="form-textarea w-full"
                          rows="3"
                          placeholder="Nhập giải thích cho đáp án đúng"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={resetQuizForm}
                          className="btn-secondary"
                        >
                          Hủy
                        </button>
                        <button type="submit" className="btn-primary">
                          <Check className="h-4 w-4 mr-2" />
                          {editingQuiz ? "Cập nhật" : "Thêm câu hỏi"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Knowledge Tab */}
          {activeTab === "knowledge" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Kiến thức cơ bản</h2>
                <button
                  onClick={() => handleContentSave("kiến thức")}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu nội dung
                </button>
              </div>

              <div>
                <textarea
                  value={content.knowledge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      knowledge: e.target.value,
                    }))
                  }
                  className="form-textarea w-full"
                  rows="15"
                  placeholder="Nhập nội dung kiến thức cơ bản về chủ đề này..."
                />
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lịch sử phát triển</h2>
                <button
                  onClick={() => handleContentSave("lịch sử")}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu nội dung
                </button>
              </div>

              <div>
                <textarea
                  value={content.history}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      history: e.target.value,
                    }))
                  }
                  className="form-textarea w-full"
                  rows="15"
                  placeholder="Nhập lịch sử phát triển của chủ đề này..."
                />
              </div>
            </div>
          )}

          {/* Application Tab */}
          {activeTab === "application" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Ứng dụng thực tế</h2>
                <button
                  onClick={() => handleContentSave("ứng dụng")}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu nội dung
                </button>
              </div>

              <div>
                <textarea
                  value={content.application}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      application: e.target.value,
                    }))
                  }
                  className="form-textarea w-full"
                  rows="15"
                  placeholder="Nhập các ứng dụng thực tế của chủ đề này..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="flex justify-center mt-8 mb-8">
          <button
            onClick={handleCreateTopic}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-3 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang tạo...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>🚀 Tạo chủ đề mới</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPreviewModal(false);
            }
          }}
        >
          <div className="bg-white rounded-lg w-[85%] h-[85%] max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Xem trước chủ đề: {topic?.title || "Chưa có tên"}
              </h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Topic Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {topic?.title || "Chưa có tên chủ đề"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {topic?.level} • {topic?.category} • {topic?.xp} XP
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {topic?.description || "Chưa có mô tả"}
                  </p>
                </div>

                {/* Prerequisites */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-600" />
                    Yêu cầu tiên quyết
                  </h4>
                  {topic.prerequisites && topic.prerequisites.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-3">
                        Học sinh phải hoàn thành các chủ đề sau trước khi có thể
                        học chủ đề này:
                      </p>
                      {topic.prerequisites.map((prereqId) => {
                        const prereqTopic = availableTopics.find(
                          (t) => t.id === prereqId
                        );
                        return prereqTopic ? (
                          <div
                            key={prereqId}
                            className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200"
                          >
                            <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-purple-800 font-medium">
                              {prereqTopic.title} ({prereqTopic.level})
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-800">
                        Chủ đề này sẽ mở khóa ngay lập tức cho học sinh (không
                        có yêu cầu tiên quyết)
                      </span>
                    </div>
                  )}
                </div>

                {/* Videos */}
                {videos.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Video className="h-5 w-5 mr-2 text-red-600" />
                      Video bài học ({videos.length})
                    </h4>
                    <div className="space-y-3">
                      {videos.map((video, index) => (
                        <div
                          key={video.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <h5 className="font-medium text-gray-900">
                            {index + 1}. {video.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {video.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quizzes */}
                {quizzes.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
                      Câu hỏi ôn tập ({quizzes.length})
                    </h4>
                    <div className="space-y-4">
                      {quizzes.map((quiz, index) => (
                        <div
                          key={quiz.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <h5 className="font-medium text-gray-900 mb-2">
                            {index + 1}. {quiz.question}
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            {quiz.answers.map((answer, answerIndex) => (
                              <div
                                key={answerIndex}
                                className={`p-2 rounded text-sm ${
                                  answerIndex === quiz.correctAnswer
                                    ? "bg-green-100 text-green-800 border border-green-300"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                {String.fromCharCode(65 + answerIndex)}.{" "}
                                {answer}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Sections */}
                <div className="space-y-6">
                  {/* Knowledge */}
                  {content.knowledge && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Kiến thức
                      </h4>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content.knowledge.replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* History */}
                  {content.history && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <History className="h-5 w-5 mr-2 text-purple-600" />
                        Lịch sử
                      </h4>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content.history.replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Application */}
                  {content.application && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                        Ứng dụng
                      </h4>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content.application.replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Empty state */}
                {videos.length === 0 &&
                  quizzes.length === 0 &&
                  !content.knowledge &&
                  !content.history &&
                  !content.application && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có nội dung
                      </h3>
                      <p className="text-gray-600">
                        Hãy thêm video, câu hỏi và nội dung lý thuyết để tạo bài
                        học hoàn chỉnh.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCreate;
