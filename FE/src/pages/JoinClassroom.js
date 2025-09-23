import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  KeyRound,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  School,
  Code,
} from "lucide-react";
import { getAllClassrooms, getClassroomByCode } from "../data/classrooms";

const JoinClassroom = () => {
  const { user, joinClassroom, hasJoinedClassroom } = useAuth();
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use shared classroom data instead of local mock data

  const handleJoinClassroom = async () => {
    if (!classCode.trim()) {
      setError("Vui lòng nhập mã lớp học");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const classroom = getClassroomByCode(classCode.toUpperCase());

      if (!classroom) {
        setError("Mã lớp học không tồn tại. Vui lòng kiểm tra lại.");
        setLoading(false);
        return;
      }

      // Check if student's grade matches classroom grade
      console.log("🔍 Debug grade comparison:");
      console.log("User grade:", user?.grade, typeof user?.grade);
      console.log("Classroom grade:", classroom.grade, typeof classroom.grade);

      // Convert both to numbers for comparison
      const userGrade = parseInt(user?.grade);
      const classroomGrade = parseInt(classroom.grade);

      if (user?.grade && userGrade !== classroomGrade) {
        setError(
          `❌ Bạn không thể tham gia lớp học này!\n\n🎓 Lớp học "${classroom.name}" dành cho học sinh lớp ${classroom.grade}\n👤 Tài khoản của bạn là học sinh lớp ${user.grade}\n\n💡 Vui lòng tìm mã lớp học phù hợp với lớp ${user.grade} của bạn.`
        );
        setLoading(false);
        return;
      }

      // Check if already joined (mock check)
      if (hasJoinedClassroom(classroom.id)) {
        setError("Bạn đã tham gia lớp học này rồi.");
        setLoading(false);
        return;
      }

      // Success - join classroom
      joinClassroom(classroom); // Save to session
      setSuccess(`Đã tham gia thành công lớp "${classroom.name}"!`);

      // Redirect to classroom view after success
      setTimeout(() => {
        navigate(`/my-classroom/${classroom.id}`);
      }, 2000);
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinClassroom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <School className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tham gia lớp học
          </h1>
          <p className="text-gray-600">
            Nhập mã lớp học mà giáo viên đã cung cấp để tham gia lớp
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Join Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã lớp học
              </label>
              <div className="relative">
                <div
                  style={{ marginTop: "16px" }}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Code className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-lg tracking-wider"
                  placeholder="VD: MATH7A"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Join Button */}
            <button
              onClick={handleJoinClassroom}
              disabled={loading || !classCode.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang tham gia...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  <span>Tham gia lớp học</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          {/* Sample Codes for Demo - Only show if user has matching grade classrooms */}
          {getAllClassrooms().filter((classroom) => {
            // Show all classrooms if user grade is not set
            if (!user?.grade) return true;
            // Only show classrooms matching user's grade
            return classroom.grade === user.grade;
          }).length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Mã lớp học có sẵn - Lớp {user?.grade || "Tất cả"}
              </h3>
              <div className="space-y-3">
                {getAllClassrooms()
                  .filter((classroom) => {
                    // Show all classrooms if user grade is not set
                    if (!user?.grade) return true;
                    // Only show classrooms matching user's grade
                    return classroom.grade === user.grade;
                  })
                  .map((classroom) => (
                    <div
                      key={classroom.code}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setClassCode(classroom.code)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-bold text-blue-600">
                              {classroom.code}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              Lớp {classroom.grade}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium">
                            {classroom.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {classroom.teacher} • {classroom.studentCount} học
                            sinh
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Nhấp vào mã lớp để tự động điền vào ô nhập
                {user?.grade && (
                  <>
                    <br />* Chỉ hiển thị lớp học dành cho học sinh lớp{" "}
                    {user.grade}
                  </>
                )}
              </p>
            </div>
          )}

          {/* No matching classrooms message */}
          {user?.grade &&
            getAllClassrooms().filter((classroom) => {
              return classroom.grade === user.grade;
            }).length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <School className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chưa có lớp học
                </h3>
                <p className="text-gray-500 text-sm">
                  Hiện tại chưa có lớp học nào dành cho học sinh lớp{" "}
                  {user.grade}.
                  <br />
                  Vui lòng liên hệ giáo viên để được cấp mã lớp học.
                </p>
              </div>
            )}
        </div>

        {/* How it works */}
        <div className="max-w-2xl mx-auto mt-12" style={{ marginTop: "45px" }}>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Cách thức hoạt động
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Nhận mã lớp</h3>
              <p className="text-gray-600 text-sm">
                Giáo viên sẽ cung cấp cho bạn mã lớp học gồm 6 ký tự
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. Nhập mã lớp</h3>
              <p className="text-gray-600 text-sm">
                Nhập mã lớp vào ô bên trên và nhấn "Tham gia lớp học"
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Bắt đầu học</h3>
              <p className="text-gray-600 text-sm">
                Tham gia lớp và bắt đầu làm bài tập cùng các bạn khác
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClassroom;
