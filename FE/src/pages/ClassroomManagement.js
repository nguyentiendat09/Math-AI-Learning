import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  BookOpen,
  Calendar,
  Copy,
  Eye,
  Edit,
  Trash2,
  Settings,
  ChevronRight,
  School,
  Code,
  UserCheck,
} from "lucide-react";
import {
  getAllClassrooms,
  saveCustomClassroom,
  getCustomClassrooms,
} from "../data/classrooms";

const ClassroomManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    description: "",
    subject: "Toán học", // Mặc định môn Toán học
    grade: "",
    code: "",
  });

  useEffect(() => {
    if (user?.role !== "teacher") {
      navigate("/");
      return;
    }
    loadClassrooms();
  }, [user, navigate]);

  const generateClassCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const loadClassrooms = () => {
    // Load all classrooms (shared + custom from localStorage)
    const allClassrooms = getAllClassrooms();
    console.log("📚 Loading all classrooms:", allClassrooms);
    setClassrooms(allClassrooms);
  };

  const handleCreateClassroom = () => {
    const code = newClassroom.code || generateClassCode();
    const classroom = {
      id: Date.now(), // Use timestamp as unique ID
      ...newClassroom,
      grade: parseInt(newClassroom.grade), // Convert to number for consistency
      code,
      teacher: user?.name || "Giáo viên",
      studentCount: 0,
      quizCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };

    console.log("🔨 Creating new classroom:", classroom);

    // Save to localStorage
    const saved = saveCustomClassroom(classroom);
    if (saved) {
      // Reload classrooms to include the new one
      loadClassrooms();

      // Reset form
      setNewClassroom({
        name: "",
        description: "",
        subject: "Toán học",
        grade: "",
        code: "",
      });
      setShowCreateModal(false);

      console.log("✅ Classroom created successfully!");
      alert(
        `Lớp học "${classroom.name}" đã được tạo thành công!\nMã lớp: ${classroom.code}`
      );
    } else {
      console.error("❌ Failed to create classroom");
      alert("Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại.");
    }
  };

  const copyClassCode = (code) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  };

  const deleteClassroom = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp học này?")) {
      setClassrooms(classrooms.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý lớp học
              </h1>
              <p className="text-gray-600">
                Tạo và quản lý các lớp học của bạn
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Tạo lớp mới</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng lớp học
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {classrooms.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <School className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng học sinh
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {classrooms.reduce((sum, c) => sum + c.studentCount, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[280px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng bài quiz
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {classrooms.reduce((sum, c) => sum + c.quizCount, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {classroom.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {classroom.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Lớp {classroom.grade}</span>
                      <span>•</span>
                      <span>{classroom.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Class Code */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Mã lớp học
                      </p>
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-blue-600" />
                        <span className="font-mono text-lg font-bold text-blue-700">
                          {classroom.code}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyClassCode(classroom.code)}
                      className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Sao chép mã lớp"
                    >
                      <Copy className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {classroom.studentCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Học sinh</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {classroom.quizCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Bài quiz</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/classroom/${classroom.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Xem chi tiết</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteClassroom(classroom.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Xóa lớp học"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {classrooms.length === 0 && (
          <div className="text-center py-12">
            <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Chưa có lớp học nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tạo lớp học đầu tiên để bắt đầu quản lý học sinh
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
            >
              Tạo lớp mới
            </button>
          </div>
        )}
      </div>

      {/* Create Classroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tạo lớp học mới
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên lớp học
                  </label>
                  <input
                    type="text"
                    value={newClassroom.name}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Toán học lớp 7A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={newClassroom.description}
                    onChange={(e) =>
                      setNewClassroom({
                        ...newClassroom,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Mô tả về lớp học..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Môn học
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      Toán học
                    </div>
                    {/* Hidden input to maintain the value */}
                    <input type="hidden" value="Toán học" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lớp
                    </label>
                    <select
                      value={newClassroom.grade}
                      onChange={(e) =>
                        setNewClassroom({
                          ...newClassroom,
                          grade: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="">Chọn lớp</option>
                      <option value="6">Lớp 6</option>
                      <option value="7">Lớp 7</option>
                      <option value="8">Lớp 8</option>
                      <option value="9">Lớp 9</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã lớp học (tùy chọn)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newClassroom.code}
                      onChange={(e) =>
                        setNewClassroom({
                          ...newClassroom,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Để trống để tự động tạo"
                    />
                    <button
                      onClick={() =>
                        setNewClassroom({
                          ...newClassroom,
                          code: generateClassCode(),
                        })
                      }
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                      title="Tạo mã ngẫu nhiên"
                    >
                      <Settings className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateClassroom}
                  disabled={!newClassroom.name || !newClassroom.grade}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Tạo lớp học
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomManagement;
