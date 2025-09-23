import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Key,
  ArrowLeft,
  LogIn,
  GraduationCap,
  Users,
} from "lucide-react";

const DemoAccounts = () => {
  const demoAccounts = [
    {
      type: "student-grade6",
      name: "Học sinh lớp 6",
      email: "student6@demo.com",
      password: "demo123",
      grade: 6,
      description: "Trải nghiệm tính năng học tập lớp 6 với AI",
      icon: GraduationCap,
      color: "from-blue-500 to-purple-600",
    },
    {
      type: "student-grade7",
      name: "Học sinh lớp 7",
      email: "student7@demo.com",
      password: "demo123",
      grade: 7,
      description: "Trải nghiệm tính năng học tập lớp 7 với AI",
      icon: GraduationCap,
      color: "from-green-500 to-blue-600",
    },
    {
      type: "student-grade8",
      name: "Học sinh lớp 8",
      email: "student8@demo.com",
      password: "demo123",
      grade: 8,
      description: "Trải nghiệm tính năng học tập lớp 8 với AI",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-600",
    },
    {
      type: "student-grade9",
      name: "Học sinh lớp 9",
      email: "student9@demo.com",
      password: "demo123",
      grade: 9,
      description: "Trải nghiệm tính năng học tập lớp 9 với AI",
      icon: GraduationCap,
      color: "from-red-500 to-orange-600",
    },
    {
      type: "teacher",
      name: "Giáo viên Demo",
      email: "teacher@demo.com",
      password: "teacher123",
      description: "Quản lý lớp học và tạo bài tập",
      icon: Users,
      color: "from-green-500 to-teal-600",
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Về trang chủ
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tài khoản Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm ngay MathAI Learning với các tài khoản demo có sẵn
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {demoAccounts.map((account) => {
            const IconComponent = account.icon;
            return (
              <div key={account.type} className="card h-full flex flex-col">
                <div className="text-center mb-6 flex-1">
                  <div
                    className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center`}
                  >
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {account.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{account.description}</p>

                  {/* Fixed height container for badge/role info */}
                  <div className="h-8 flex items-center justify-center">
                    {account.grade ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Lớp {account.grade}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Giáo viên
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Email:
                      </label>
                      <button
                        onClick={() => copyToClipboard(account.email)}
                        className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-gray-800">
                        {account.email}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Mật khẩu:
                      </label>
                      <button
                        onClick={() => copyToClipboard(account.password)}
                        className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-gray-800">
                        {account.password}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-lg`}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Đăng nhập ngay
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              💡 Lưu ý
            </h3>
            <p className="text-amber-700">
              Đây là tài khoản demo để trải nghiệm dịch vụ.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Hoặc đăng ký tài khoản mới →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoAccounts;
