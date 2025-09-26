import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Save,
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
  Plus,
} from "lucide-react";

const TopicEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("🔧 TopicEdit component loaded for editing topic ID:", id);

  // Cleanup URLs when component unmounts
  const [objectURLs, setObjectURLs] = useState([]);

  const createObjectURL = (file) => {
    const url = URL.createObjectURL(file);
    setObjectURLs((prev) => [...prev, url]);
    return url;
  };

  useEffect(() => {
    return () => {
      // Cleanup all object URLs to prevent memory leaks
      objectURLs.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn("Failed to revoke object URL:", error);
        }
      });
    };
  }, [objectURLs]);

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
    uploadType: "url",
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

  // Check if this is a sample topic (ID 1-4)
  const isSampleTopic = () => {
    const topicId = parseInt(id);
    return topicId >= 1 && topicId <= 4;
  };

  // Check teacher role
  useEffect(() => {
    if (user?.role !== "teacher") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  // ===== MAIN UPDATE FUNCTION =====
  const handleUpdateTopic = () => {
    console.log("🔄 === UPDATING EXISTING TOPIC ===");
    console.log("Topic ID to update:", id);

    // Check if this is a sample topic (ID 1-4) - prevent editing
    if (isSampleTopic()) {
      alert(
        "⚠️ Không thể chỉnh sửa chủ đề mẫu!\n\nCác chủ đề với ID từ 1-4 là dữ liệu mẫu hệ thống và không được phép chỉnh sửa.\nVui lòng tạo chủ đề mới hoặc chỉnh sửa các chủ đề do bạn tạo."
      );
      return;
    }

    if (!topic?.title?.trim()) {
      alert("❌ Vui lòng nhập tên chủ đề!");
      return;
    }

    if (!id || id === "new") {
      alert("❌ Không tìm thấy ID chủ đề để cập nhật!");
      return;
    }

    setLoading(true);

    try {
      // Tạo topic object đã cập nhật
      const updatedTopic = {
        ...topic,
        id: parseInt(id),
        title: topic.title.trim(),
        description: topic.description.trim(),
        level: topic.level,
        category: topic.category,
        xp: parseInt(topic.xp) || 100,
        prerequisites: topic.prerequisites || [],
        videos: videos,
        quizzes: quizzes,
        content: content,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.id || "teacher",
      };

      console.log("📝 Updated topic data:", updatedTopic);

      // Lấy topics từ localStorage
      const existingTopics = JSON.parse(localStorage.getItem("topics") || "[]");
      console.log(
        "📋 Current localStorage topics count:",
        existingTopics.length
      );

      // Tìm topic trong localStorage trước
      const topicIndex = existingTopics.findIndex(
        (t) => t.id === parseInt(id) || t.id === id || t.id.toString() === id
      );
      console.log("🔍 Topic index in localStorage:", topicIndex);

      if (topicIndex !== -1) {
        // Topic đã tồn tại trong localStorage - cập nhật
        existingTopics[topicIndex] = updatedTopic;
        console.log("🔄 Updated existing topic in localStorage");
      } else {
        // Topic chưa có trong localStorage (có thể là mock topic) - thêm mới
        existingTopics.push(updatedTopic);
        console.log("➕ Added new topic to localStorage (was mock topic)");
      }

      // Lưu vào localStorage
      localStorage.setItem("topics", JSON.stringify(existingTopics));
      console.log("💾 Topic saved to localStorage");

      // Trigger event cho LearningMap
      const customEvent = new CustomEvent("localStorageUpdated", {
        detail: {
          action: "topic_updated",
          topic: updatedTopic,
        },
      });
      window.dispatchEvent(customEvent);
      console.log("📡 Event dispatched to LearningMap");

      // Thông báo thành công
      alert("✅ Cập nhật chủ đề thành công!");

      // Chuyển về learning map
      navigate("/learning-map");
    } catch (error) {
      console.error("❌ Error updating topic:", error);
      alert("Có lỗi xảy ra khi cập nhật chủ đề!");
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH TOPIC DATA =====
  const fetchTopicData = useCallback(async () => {
    console.log("📥 === FETCHING TOPIC DATA FOR EDIT ===");
    console.log("Topic ID:", id);

    if (!id || id === "new") {
      console.log("❌ Invalid ID for editing - redirecting to create page");
      navigate("/topic/create");
      return;
    }

    setLoading(true);

    try {
      // Lấy topic từ localStorage
      const localTopics = JSON.parse(localStorage.getItem("topics") || "[]");

      // Define mock topics (same as in LearningMap) for fallback
      const mockTopics = [
        {
          id: 1,
          title: "Số nguyên",
          description: "Khám phá thế giới số âm và số dương",
          level: "Lớp 6",
          category: "Đại số",
          xp: 100,
          prerequisites: [],
          videos: [
            {
              id: 1,
              title: "Video bài học số nguyên",
              description: "Học về số nguyên qua video",
              url: "https://www.youtube.com/watch?v=j2ltarHUGnM",
              duration: "10:00",
            },
          ],
          quizzes: [],
          content: {
            knowledge:
              "Số nguyên bao gồm các số tự nhiên, số 0 và các số âm. Chúng được sắp xếp trên trục số và có các quy tắc tính toán riêng.",
            history:
              "Khái niệm số âm xuất hiện từ thời cổ đại ở Trung Quốc và Ấn Độ để biểu diễn nợ và thiếu hụt.",
            application:
              "Số nguyên được sử dụng trong đo nhiệt độ, tài chính (nợ/có), và nhiều lĩnh vực khác.",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isUnlocked: true,
        },
        {
          id: 2,
          title: "Phân số",
          description: "Hiểu về các phần của một tổng thể",
          level: "Lớp 6",
          category: "Đại số",
          xp: 120,
          prerequisites: [1],
          videos: [
            {
              id: 1,
              title: "Video bài học phân số",
              description: "Học về phân số qua video",
              url: "https://www.youtube.com/watch?v=j2ltarHUGnM",
              duration: "10:00",
            },
          ],
          quizzes: [],
          content: {
            knowledge:
              "Phân số biểu diễn một phần của tổng thể. Gồm tử số và mẫu số, có các phép toán cộng, trừ, nhân, chia riêng.",
            history:
              "Phân số được sử dụng từ thời Ai Cập cổ đại để chia bánh mì và đất đai.",
            application:
              "Phân số xuất hiện trong nấu ăn, xây dựng, âm nhạc và nhiều hoạt động hàng ngày.",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isUnlocked: true,
        },
        {
          id: 3,
          title: "Định lý Pythagore",
          description: "Khám phá mối quan hệ giữa các cạnh tam giác vuông",
          level: "Lớp 8",
          category: "Hình học",
          xp: 150,
          prerequisites: [],
          videos: [
            {
              id: 1,
              title: "Video bài học định lý Pythagore",
              description: "Học về định lý Pythagore qua video",
              url: "https://www.youtube.com/watch?v=j2ltarHUGnM",
              duration: "10:00",
            },
          ],
          quizzes: [],
          content: {
            knowledge:
              "Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông: a² + b² = c²",
            history:
              "Mặc dù mang tên Pythagore, định lý này đã được biết đến ở Babylon và Ai Cập từ hàng nghìn năm trước.",
            application:
              "Định lý Pythagore được sử dụng trong xây dựng, navigation, computer graphics và nhiều lĩnh vực kỹ thuật.",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isUnlocked: true,
        },
        {
          id: 4,
          title: "Xác suất cơ bản",
          description: "Tính toán khả năng xảy ra của các sự kiện",
          level: "Lớp 7",
          category: "Thống kê",
          xp: 130,
          prerequisites: [2],
          videos: [
            {
              id: 1,
              title: "Video bài học xác suất cơ bản",
              description: "Học về xác suất qua video",
              url: "https://www.youtube.com/watch?v=j2ltarHUGnM",
              duration: "10:00",
            },
          ],
          quizzes: [],
          content: {
            knowledge:
              "Xác suất là khả năng xảy ra của một sự kiện, được tính bằng số kết quả thuận lợi chia cho tổng số kết quả có thể.",
            history:
              "Lý thuyết xác suất phát triển từ các trò chơi may rủi ở Pháp thế kỷ 17 bởi Pascal và Fermat.",
            application:
              "Xác suất được dùng trong bảo hiểm, dự báo thời tiết, y học, và ra quyết định trong kinh doanh.",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isUnlocked: true,
        },
      ];

      // Combine all topics (localStorage + mock)
      const allTopics = [...localTopics, ...mockTopics];

      // Handle both string and number IDs
      const foundTopic = allTopics.find(
        (t) => t.id === parseInt(id) || t.id === id || t.id.toString() === id
      );

      if (!foundTopic) {
        console.log("❌ Topic not found in both localStorage and mock data");
        console.log(
          "Available topics:",
          allTopics.map((t) => ({ id: t.id, title: t.title }))
        );
        alert("Không tìm thấy chủ đề để chỉnh sửa!");
        navigate("/learning-map");
        return;
      }

      console.log("✅ Topic found:", foundTopic);

      // Set topic data
      setTopic(foundTopic);
      setVideos(foundTopic.videos || []);
      setQuizzes(foundTopic.quizzes || []);
      setContent(
        foundTopic.content || {
          knowledge: "",
          history: "",
          application: "",
        }
      );

      console.log("✅ Topic data loaded for editing");
    } catch (error) {
      console.error("❌ Error fetching topic:", error);
      alert("Có lỗi xảy ra khi tải dữ liệu chủ đề!");
      navigate("/learning-map");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTopicData();
  }, [fetchTopicData]);

  // ===== VIDEO FUNCTIONS =====
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const videoData = { ...videoForm };

      if (videoForm.uploadType === "file" && videoForm.file) {
        // Tạo object URL cho file để hiển thị
        const fileURL = createObjectURL(videoForm.file);

        // Lưu file vào localStorage như base64 (chỉ cho demo)
        const reader = new FileReader();
        reader.onload = function (e) {
          const fileData = {
            name: videoForm.file.name,
            type: videoForm.file.type,
            size: videoForm.file.size,
            data: e.target.result, // Base64 data
            url: fileURL, // Object URL for display
          };

          videoData.file = fileData;
          videoData.url = e.target.result; // Sử dụng base64 làm URL chính

          console.log("📹 Video data prepared:", {
            title: videoData.title,
            uploadType: videoData.uploadType,
            fileSize: fileData.size,
            dataLength: e.target.result.length,
          });

          // Tiến hành lưu video
          saveVideoData(videoData);
        };
        reader.readAsDataURL(videoForm.file);
        return;
      }

      saveVideoData(videoData);
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Có lỗi xảy ra khi lưu video");
      setUploading(false);
    }
  };

  const saveVideoData = (videoData) => {
    try {
      console.log("💾 Saving video data:", videoData);

      // Đảm bảo video data có đúng format để lưu và hiển thị
      if (videoData.uploadType === "file" && videoData.file) {
        // Đối với file upload, đảm bảo URL là base64
        if (!videoData.url || !videoData.url.startsWith("data:")) {
          videoData.url = videoData.file.data;
        }
        console.log(
          "📹 File video URL set to base64, length:",
          videoData.url?.length
        );
      }

      if (editingVideo) {
        const updatedVideos = videos.map((video) =>
          video.id === editingVideo.id
            ? { ...editingVideo, ...videoData }
            : video
        );
        setVideos(updatedVideos);
        console.log("✏️ Updated existing video");
      } else {
        const newVideo = {
          id: Date.now(),
          ...videoData,
        };
        setVideos([...videos, newVideo]);
        console.log("➕ Added new video:", newVideo.id);
      }
      resetVideoForm();
      alert(editingVideo ? "Video đã được cập nhật" : "Video đã được thêm");
    } catch (error) {
      console.error("Error saving video data:", error);
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
        const updatedQuizzes = quizzes.map((quiz) =>
          quiz.id === editingQuiz.id ? { ...editingQuiz, ...quizForm } : quiz
        );
        setQuizzes(updatedQuizzes);
      } else {
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
        <div className="ml-4 text-lg">Đang tải dữ liệu chủ đề...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            ❌ Không tìm thấy chủ đề
          </div>
          <button
            onClick={() => navigate("/learning-map")}
            className="btn-primary"
          >
            Về danh sách chủ đề
          </button>
        </div>
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
                🔧 Chỉnh sửa chủ đề
              </h1>
              <p className="text-gray-600 mt-1">
                Chỉnh sửa: <strong>{topic?.title}</strong>
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
                    if (isSampleTopic()) {
                      alert("⚠️ Không thể chỉnh sửa chủ đề mẫu!");
                      return;
                    }
                    if (!topic?.title?.trim()) {
                      alert("Vui lòng nhập tên chủ đề!");
                      return;
                    }
                    alert("Thông tin đã được cập nhật tạm thời!");
                  }}
                  disabled={isSampleTopic()}
                  className={`${
                    isSampleTopic() ? "btn-disabled" : "btn-primary"
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thông tin
                </button>
              </div>

              {/* Sample Topic Warning */}
              {isSampleTopic() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Chủ đề mẫu hệ thống
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Đây là chủ đề mẫu của hệ thống (ID: {id}). Bạn có thể
                          xem nội dung nhưng không thể chỉnh sửa dữ liệu. Để tạo
                          nội dung riêng, vui lòng sử dụng chức năng "Tạo chủ đề
                          mới".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      className={`form-input w-full ${
                        isSampleTopic() ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      placeholder="Nhập tên chủ đề"
                      required
                      disabled={isSampleTopic()}
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
                      className={`form-textarea w-full ${
                        isSampleTopic() ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      rows="4"
                      placeholder="Nhập mô tả chủ đề"
                      required
                      disabled={isSampleTopic()}
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
                      className={`form-select w-full ${
                        isSampleTopic() ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      disabled={isSampleTopic()}
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
                      className={`form-select w-full ${
                        isSampleTopic() ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      disabled={isSampleTopic()}
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
                      className={`form-input w-full ${
                        isSampleTopic() ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      placeholder="Nhập điểm XP (50-500)"
                      min="50"
                      max="500"
                      disabled={isSampleTopic()}
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

                        {/* Video Preview */}
                        <div className="mt-3">
                          {video.uploadType === "url" && video.url ? (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">
                                URL: {video.url}
                              </p>
                              {video.url.includes("youtube.com") ||
                              video.url.includes("youtu.be") ? (
                                <div className="w-full max-w-md">
                                  <iframe
                                    width="100%"
                                    height="200"
                                    src={video.url
                                      .replace("watch?v=", "embed/")
                                      .replace(
                                        "youtu.be/",
                                        "youtube.com/embed/"
                                      )}
                                    title={video.title}
                                    frameBorder="0"
                                    allowFullScreen
                                    className="rounded-lg"
                                  ></iframe>
                                </div>
                              ) : (
                                <video
                                  controls
                                  className="w-full max-w-md h-48 bg-black rounded-lg"
                                  src={video.url}
                                >
                                  Trình duyệt của bạn không hỗ trợ video.
                                </video>
                              )}
                            </div>
                          ) : video.file ||
                            (video.uploadType === "file" && video.url) ? (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">
                                File: {video.file?.name || "Video đã upload"}
                              </p>
                              <video
                                controls
                                className="w-full max-w-md h-48 bg-black rounded-lg"
                                src={
                                  // Ưu tiên sử dụng base64 data nếu có
                                  video.file?.data ||
                                  // Hoặc sử dụng URL nếu là base64
                                  (video.url && video.url.startsWith("data:"))
                                    ? video.url
                                    : // Hoặc sử dụng object URL nếu file object
                                    typeof video.file === "string"
                                    ? video.file
                                    : video.file?.url || video.url
                                }
                              >
                                Trình duyệt của bạn không hỗ trợ video.
                              </video>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Không có video để hiển thị
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingVideo(video);
                            setVideoForm({
                              title: video.title,
                              description: video.description,
                              url: video.url || "",
                              file: null,
                              uploadType:
                                video.uploadType ||
                                (video.url ? "url" : "file"),
                            });
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
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setVideoForm((prev) => ({
                                ...prev,
                                file: file,
                              }));
                            }}
                            className="form-input w-full"
                            required
                          />

                          {/* Video Preview */}
                          {videoForm.file && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Xem trước video:
                              </label>
                              <div className="w-full max-w-md bg-black rounded-lg overflow-hidden">
                                <video
                                  controls
                                  className="w-full h-48"
                                  src={
                                    videoForm.file instanceof File
                                      ? createObjectURL(videoForm.file)
                                      : ""
                                  }
                                >
                                  Trình duyệt của bạn không hỗ trợ video.
                                </video>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Tên file: {videoForm.file.name}
                                <br />
                                Kích thước:{" "}
                                {(videoForm.file.size / (1024 * 1024)).toFixed(
                                  2
                                )}{" "}
                                MB
                              </p>
                            </div>
                          )}
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

        {/* Update Button */}
        <div className="flex justify-center mt-8 mb-8">
          <button
            onClick={handleUpdateTopic}
            disabled={loading || isSampleTopic()}
            className={`px-8 py-3 text-white rounded-lg transition-all duration-200 flex items-center space-x-3 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isSampleTopic()
                ? "bg-gray-400"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang cập nhật...</span>
              </>
            ) : isSampleTopic() ? (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>🔒 Chủ đề mẫu (chỉ xem)</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>💾 Cập nhật chủ đề</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal - Same as TopicCreate but for editing */}
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

                {/* Rest of preview content same as TopicCreate */}
                {/* Videos, Quizzes, Content sections... */}
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

export default TopicEdit;
