import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Target,
} from "lucide-react";

const TopicEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("TopicEdit component loaded with id:", id, typeof id);

  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);

  // Video state
  const [videos, setVideos] = useState([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: "",
    url: "",
    description: "",
    file: null,
    uploadType: "url", // 'url' or 'upload'
  });
  const [uploading, setUploading] = useState(false);

  // Quiz state
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  // Content state
  const [content, setContent] = useState({
    knowledge: "",
    history: "",
    application: "",
  });

  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Save topic to localStorage
  const handleCreateNewTopic = () => {
    console.log("=== CREATING NEW TOPIC ===");
    console.log("Current URL id:", id);

    // Validation - kiểm tra các trường bắt buộc
    if (!topic?.title?.trim()) {
      alert("Vui lòng nhập tên chủ đề!");
      return;
    }

    if (!topic?.description?.trim()) {
      alert("Vui lòng nhập mô tả chủ đề!");
      return;
    }

    // Tạo topic mới với ID unique
    const newTopicData = {
      id: Date.now(), // Tạo ID unique
      title: topic.title.trim(),
      description: topic.description.trim(),
      level: topic.level || "Lớp 6",
      category: topic.category || "Đại số",
      xp: parseInt(topic.xp) || 100,
      prerequisites: [],
      videos: videos || [],
      quizzes: quizzes || [],
      content: {
        knowledge: content?.knowledge || "",
        history: content?.history || "",
        application: content?.application || "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isUnlocked: true,
    };

    console.log("New topic data:", newTopicData);

    try {
      // Lấy danh sách topics hiện có từ localStorage
      const existingTopics = JSON.parse(localStorage.getItem("topics") || "[]");
      console.log("Existing topics count:", existingTopics.length);

      // Thêm topic mới vào danh sách
      existingTopics.push(newTopicData);

      // Lưu vào localStorage
      localStorage.setItem("topics", JSON.stringify(existingTopics));
      console.log("✅ Topic saved to localStorage");

      // Trigger event để notify LearningMap
      const event = new CustomEvent("localStorageUpdated", {
        detail: { action: "topic_created", topic: newTopicData },
      });
      window.dispatchEvent(event);
      console.log("✅ Event dispatched");

      // Thông báo thành công
      alert("🎉 Thêm chủ đề mới thành công!");

      // Chuyển về learning map
      navigate("/learning-map");
    } catch (error) {
      console.error("❌ Error creating topic:", error);
      alert("Có lỗi xảy ra khi tạo chủ đề mới!");
    }
  };

  const fetchTopicData = useCallback(async () => {
    console.log("=== INITIALIZING CREATE NEW TOPIC PAGE ===");
    console.log("Route ID:", id);

    // This page is ONLY for creating new topics
    if (id !== "new") {
      console.log("❌ Wrong route - this page only for new topics");
      setLoading(false);
      return;
    }

    // Initialize empty form for new topic creation
    setTopic({
      id: "new",
      title: "",
      description: "",
      level: "Lớp 6",
      category: "Đại số",
      xp: 100,
      prerequisites: [],
    });

    setVideos([]);
    setQuizzes([]);
    setContent({
      knowledge: "",
      history: "",
      application: "",
    });

    console.log("✅ New topic form initialized");
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (user?.role !== "teacher") {
      navigate("/dashboard");
      return;
    }
    fetchTopicData();
  }, [id, user, navigate, fetchTopicData]);

  // Video CRUD operations
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      let videoData = { ...videoForm };

      // Handle file upload
      if (videoForm.uploadType === "upload" && videoForm.file) {
        const formData = new FormData();
        formData.append("video", videoForm.file);
        formData.append("title", videoForm.title);
        formData.append("description", videoForm.description);

        // In real app, upload to server
        // const uploadRes = await axios.post(`/api/topics/${id}/videos/upload`, formData);
        // videoData.url = uploadRes.data.url;

        // For demo, create a mock URL
        videoData.url = `/uploads/videos/${videoForm.file.name}`;
        videoData.file = null; // Don't store file in state
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

  // Quiz CRUD operations
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

  // Content operations
  const handleContentSave = async (section) => {
    try {
      // Save content to backend
      alert(`Nội dung ${section} đã được lưu`);
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
        <div className="spinner"></div>
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
                {id === "new" ? "🎯 Tạo chủ đề mới" : "❌ Trang không hợp lệ"}
              </h1>
              {id === "new" && (
                <p className="text-gray-600 mt-1">
                  Điền thông tin để tạo chủ đề học tập mới
                </p>
              )}
              {id !== "new" && (
                <p className="text-red-600 mt-1">
                  Trang này chỉ dành cho tạo chủ đề mới
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="btn-secondary"
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </button>
          </div>
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

        {/* Tab Content */}
        <div className="card">
          {/* Topic Info Tab */}
          {activeTab === "info" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Thông tin chủ đề</h2>
                <button
                  onClick={() => {
                    console.log("=== SAVE INFO CLICKED ===");
                    console.log("Current ID:", id);

                    if (id === "new") {
                      // For new topics - just save temporarily in state
                      if (!topic?.title?.trim()) {
                        alert("Vui lòng nhập tên chủ đề!");
                        return;
                      }

                      console.log("✅ Topic info saved temporarily in state");
                      alert(
                        "Thông tin chủ đề đã được lưu tạm thời! Hãy thêm video, quiz, nội dung rồi nhấn 'Tạo chủ đề mới' ở cuối trang."
                      );
                    } else {
                      // For non-new routes - show error
                      alert("Trang này chỉ dành cho tạo chủ đề mới!");
                    }
                  }}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thông tin tạm thời
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
                      className="form-input w-full h-24 resize-none"
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
                      onChange={(e) =>
                        setTopic((prev) => ({ ...prev, level: e.target.value }))
                      }
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
                      value={topic?.xp || ""}
                      onChange={(e) =>
                        setTopic((prev) => ({ ...prev, xp: e.target.value }))
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
                    <input
                      type="text"
                      placeholder="Chưa có chức năng chọn yêu cầu tiên quyết"
                      className="form-input w-full"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tính năng này sẽ được phát triển trong phiên bản tiếp theo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quản lý Video</h2>
                <button
                  onClick={() => setShowVideoForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Video
                </button>
              </div>

              {/* Video List */}
              <div className="space-y-4 mb-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600">
                        {video.description}
                      </p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {video.url}
                      </a>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingVideo(video);
                          setVideoForm(video);
                          setShowVideoForm(true);
                        }}
                        className="btn-secondary"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="btn-secondary text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Form */}
              {showVideoForm && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingVideo ? "Chỉnh sửa Video" : "Thêm Video Mới"}
                  </h3>
                  <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div>
                      <label className="form-label">Tiêu đề</label>
                      <input
                        type="text"
                        value={videoForm.title}
                        onChange={(e) =>
                          setVideoForm({ ...videoForm, title: e.target.value })
                        }
                        className="form-input"
                        required
                      />
                    </div>

                    {/* Upload Type Selection */}
                    <div>
                      <label className="form-label">Loại video</label>
                      <div className="flex space-x-4 mb-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="uploadType"
                            value="url"
                            checked={videoForm.uploadType === "url"}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                uploadType: e.target.value,
                                file: null,
                              })
                            }
                            className="mr-2"
                          />
                          URL Video (YouTube, Vimeo...)
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="uploadType"
                            value="upload"
                            checked={videoForm.uploadType === "upload"}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                uploadType: e.target.value,
                                url: "",
                              })
                            }
                            className="mr-2"
                          />
                          Upload từ máy tính
                        </label>
                      </div>
                    </div>

                    {/* URL Input */}
                    {videoForm.uploadType === "url" && (
                      <div>
                        <label className="form-label">URL Video</label>
                        <input
                          type="url"
                          value={videoForm.url}
                          onChange={(e) =>
                            setVideoForm({ ...videoForm, url: e.target.value })
                          }
                          className="form-input"
                          placeholder="https://www.youtube.com/watch?v=..."
                          required
                        />
                      </div>
                    )}

                    {/* File Upload */}
                    {videoForm.uploadType === "upload" && (
                      <div>
                        <label className="form-label">Chọn file video</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setVideoForm({ ...videoForm, file });
                            }}
                            className="hidden"
                            id="video-upload"
                            required
                          />
                          <label
                            htmlFor="video-upload"
                            className="cursor-pointer"
                          >
                            {videoForm.file ? (
                              <div className="flex items-center justify-center space-x-2 text-green-600">
                                <Check className="h-5 w-5" />
                                <span>{videoForm.file.name}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Kéo thả file hoặc click để chọn
                                </span>
                                <span className="text-xs text-gray-400">
                                  Hỗ trợ: MP4, AVI, MOV (tối đa 100MB)
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                        {uploading && (
                          <div className="mt-2 flex items-center space-x-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Đang upload...</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="form-label">Mô tả</label>
                      <textarea
                        value={videoForm.description}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            description: e.target.value,
                          })
                        }
                        className="form-textarea"
                        rows="3"
                        placeholder="Mô tả ngắn về nội dung video..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={uploading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {uploading
                          ? "Đang xử lý..."
                          : editingVideo
                          ? "Cập nhật"
                          : "Thêm"}
                      </button>
                      <button
                        type="button"
                        onClick={resetVideoForm}
                        className="btn-secondary"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quản lý Quiz</h2>
                <button
                  onClick={() => setShowQuizForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Câu Hỏi
                </button>
              </div>

              {/* Quiz List */}
              <div className="space-y-4 mb-6">
                {quizzes.map((quiz, index) => (
                  <div key={quiz.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">
                        Câu {index + 1}: {quiz.question}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setQuizForm(quiz);
                            setShowQuizForm(true);
                          }}
                          className="btn-secondary"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="btn-secondary text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {quiz.answers.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className={`p-2 rounded text-sm ${
                            answerIndex === quiz.correctAnswer
                              ? "bg-green-100 text-green-800 font-semibold"
                              : "bg-gray-100"
                          }`}
                        >
                          {String.fromCharCode(65 + answerIndex)}. {answer}
                        </div>
                      ))}
                    </div>
                    {quiz.explanation && (
                      <p className="text-sm text-gray-600 italic">
                        Giải thích: {quiz.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Quiz Form */}
              {showQuizForm && (
                <div className="border-t pt-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                    {editingQuiz ? "Chỉnh sửa Câu Hỏi" : "Thêm Câu Hỏi Mới"}
                  </h3>
                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="form-label text-gray-700 font-medium">
                        Câu hỏi
                      </label>
                      <textarea
                        value={quizForm.question}
                        onChange={(e) =>
                          setQuizForm({ ...quizForm, question: e.target.value })
                        }
                        className="form-textarea mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        rows="3"
                        placeholder="Nhập câu hỏi của bạn..."
                        required
                      />
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <label className="form-label text-gray-700 font-medium mb-4 block">
                        Các đáp án (chọn đáp án đúng)
                      </label>
                      {quizForm.answers.map((answer, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 mb-3 p-3 rounded-lg border-2 transition-colors ${
                            quizForm.correctAnswer === index
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={quizForm.correctAnswer === index}
                            onChange={() =>
                              setQuizForm({ ...quizForm, correctAnswer: index })
                            }
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => {
                              const newAnswers = [...quizForm.answers];
                              newAnswers[index] = e.target.value;
                              setQuizForm({ ...quizForm, answers: newAnswers });
                            }}
                            placeholder={`Nhập đáp án ${String.fromCharCode(
                              65 + index
                            )}`}
                            className="form-input flex-1 border-0 focus:ring-0 bg-transparent"
                            required
                          />
                          {quizForm.correctAnswer === index && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <label className="form-label text-gray-700 font-medium">
                        Giải thích (tùy chọn)
                      </label>
                      <textarea
                        value={quizForm.explanation}
                        onChange={(e) =>
                          setQuizForm({
                            ...quizForm,
                            explanation: e.target.value,
                          })
                        }
                        className="form-textarea mt-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        rows="3"
                        placeholder="Giải thích tại sao đáp án này đúng..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button type="submit" className="btn-primary flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        {editingQuiz ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
                      </button>
                      <button
                        type="button"
                        onClick={resetQuizForm}
                        className="btn-secondary px-6"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Content Tabs */}
          {(activeTab === "knowledge" ||
            activeTab === "history" ||
            activeTab === "application") && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  {activeTab === "knowledge" && (
                    <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
                  )}
                  {activeTab === "history" && (
                    <History className="h-6 w-6 mr-2 text-blue-500" />
                  )}
                  {activeTab === "application" && (
                    <Target className="h-6 w-6 mr-2 text-green-500" />
                  )}
                  {id === "new" ? "Thêm" : "Chỉnh sửa"}{" "}
                  {activeTab === "knowledge"
                    ? "Kiến thức"
                    : activeTab === "history"
                    ? "Lịch sử"
                    : "Ứng dụng"}
                </h2>
                <button
                  onClick={() => handleContentSave(activeTab)}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu nội dung
                </button>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <label className="form-label text-gray-700 font-medium mb-4 block">
                  Nội dung chi tiết
                </label>

                {/* Rich Text Toolbar */}
                <div className="border border-gray-200 rounded-t-lg p-3 bg-gray-50 flex items-center space-x-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    onClick={() => {
                      const textarea = document.getElementById(
                        `content-${activeTab}`
                      );
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const selected = text.substring(start, end);
                      const after = text.substring(end);
                      const newText =
                        before + `**${selected || "text"}**` + after;
                      setContent({ ...content, [activeTab]: newText });
                    }}
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    onClick={() => {
                      const textarea = document.getElementById(
                        `content-${activeTab}`
                      );
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const before = text.substring(0, start);
                      const selected = text.substring(start, end);
                      const after = text.substring(end);
                      const newText =
                        before + `*${selected || "text"}*` + after;
                      setContent({ ...content, [activeTab]: newText });
                    }}
                  >
                    <em>I</em>
                  </button>
                  <div className="border-l border-gray-300 h-6"></div>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    onClick={() => {
                      const newContent = content[activeTab] + "\n\n• ";
                      setContent({ ...content, [activeTab]: newContent });
                    }}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                    onClick={() => {
                      const newContent = content[activeTab] + "\n\n1. ";
                      setContent({ ...content, [activeTab]: newContent });
                    }}
                  >
                    1.2.3
                  </button>
                  <div className="border-l border-gray-300 h-6"></div>
                  <span className="text-xs text-gray-500">
                    Hỗ trợ Markdown: **bold**, *italic*, • bullet points
                  </span>
                </div>

                <textarea
                  id={`content-${activeTab}`}
                  value={content[activeTab]}
                  onChange={(e) =>
                    setContent({ ...content, [activeTab]: e.target.value })
                  }
                  className="form-textarea rounded-t-none border-t-0 min-h-[400px] font-mono text-sm"
                  rows="15"
                  placeholder={`Nhập nội dung ${
                    activeTab === "knowledge"
                      ? "kiến thức cơ bản, định nghĩa, công thức..."
                      : activeTab === "history"
                      ? "lịch sử phát triển, nhà toán học liên quan..."
                      : "ứng dụng thực tế, ví dụ trong đời sống..."
                  }

Ví dụ:
**Định nghĩa:**
${
  activeTab === "knowledge"
    ? "Số nguyên là tập hợp các số bao gồm..."
    : activeTab === "history"
    ? "Khái niệm số nguyên được phát triển từ thế kỷ..."
    : "Số nguyên được ứng dụng trong:"
}

• Điểm thứ nhất
• Điểm thứ hai

1. Mục đầu tiên
2. Mục thứ hai`}
                />

                {/* Preview */}
                {content[activeTab] && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Xem trước
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: content[activeTab]
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.*?)\*/g, "<em>$1</em>")
                            .replace(/^• (.+)$/gm, "<li>$1</li>")
                            .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
                            .replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button for New Topic ONLY */}
        {id === "new" && (
          <div className="flex justify-center mt-8 mb-8">
            <button
              onClick={handleCreateNewTopic}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-3 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>Tạo chủ đề mới</span>
            </button>
          </div>
        )}

        {/* Message for non-new routes */}
        {id !== "new" && (
          <div className="flex justify-center mt-8 mb-8">
            <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="text-yellow-800 font-medium mb-2">
                Trang này chỉ dành cho tạo chủ đề mới
              </div>
              <div className="text-yellow-600 text-sm">
                Để chỉnh sửa chủ đề hiện có, vui lòng truy cập từ danh sách chủ
                đề
              </div>
              <button
                onClick={() => navigate("/learning-map")}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Về danh sách chủ đề
              </button>
            </div>
          </div>
        )}
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
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white relative z-10">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  Xem trước: {topic?.title || "Chủ đề mới"}
                </h2>
                <p className="text-gray-600 mt-1 truncate">
                  {topic?.description || "Mô tả chủ đề"}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4 flex-shrink-0"
                title="Đóng modal"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Topic Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {topic?.title || "Tên chủ đề"}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{topic?.level || "Lớp 6"}</span>
                            <span>•</span>
                            <span>{topic?.category || "Đại số"}</span>
                            <span>•</span>
                            <span>{topic?.xp || "100"} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {topic?.description ||
                        "Mô tả chi tiết về chủ đề sẽ hiển thị ở đây"}
                    </p>
                  </div>

                  {/* Videos Section */}
                  {videos.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Video className="h-5 w-5 mr-2 text-blue-600" />
                        Video bài học ({videos.length})
                      </h4>
                      <div className="space-y-3">
                        {videos.map((video, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <Video className="h-4 w-4 text-blue-600 mr-3" />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {video.title}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quizzes Section */}
                  {quizzes.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
                        Câu hỏi ôn tập ({quizzes.length})
                      </h4>
                      <div className="space-y-4">
                        {quizzes.map((quiz, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
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
                              __html: content.application.replace(
                                /\n/g,
                                "<br>"
                              ),
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
                          Hãy thêm video, câu hỏi và nội dung lý thuyết để tạo
                          bài học hoàn chỉnh.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
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

export default TopicEdit;
