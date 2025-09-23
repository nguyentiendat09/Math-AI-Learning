import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Trophy,
  Map,
  Zap,
  Home,
  Settings,
  Users,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navItems = user
    ? user.role === "teacher"
      ? [
          { to: "/dashboard", icon: Home, label: "Dashboard" },
          {
            to: "/classroom-management",
            icon: Users,
            label: "Quản lý lớp học",
          },
          { to: "/learning-map", icon: Map, label: "Bản đồ học tập" },
          { to: "/ai-generator", icon: Zap, label: "AI Generator" },
          { to: "/profile", icon: User, label: "Hồ sơ" },
        ]
      : [
          { to: "/dashboard", icon: Home, label: "Dashboard" },
          { to: "/join-classroom", icon: Users, label: "Tham gia lớp học" },
          { to: "/learning-map", icon: Map, label: "Bản đồ học tập" },
          { to: "/ai-generator", icon: Zap, label: "AI Generator" },
          { to: "/leaderboard", icon: Trophy, label: "Bảng xếp hạng" },
          { to: "/profile", icon: User, label: "Hồ sơ" },
        ]
    : [];

  // Không thêm menu riêng cho teacher nữa - dùng chung Dashboard

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center group">
              {/* Logo Icon */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <BookOpen className="h-7 w-7 text-white" />
              </div>

              {/* Brand Text - Separated with better spacing */}
              <div className="ml-4 flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-none tracking-tight">
                  MathAI
                </span>
                <span className="text-sm font-medium text-blue-600 leading-none">
                  Learning
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-3 xl:space-x-6 flex-1 justify-center">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent
                    style={{ marginRight: "5px" }}
                    className="h-4 w-4"
                  />
                  <span className="text-base font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - User Info and Logout */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <>
                <div className="flex items-center">
                  {user.level && user.xp && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all px-3 py-1 rounded-full text-base font-semibold whitespace-nowrap">
                      Level {user.level} : {user.xp} XP
                    </div>
                  )}
                </div>

                {/* Logout Button - Right side, far right */}
                <button
                  onClick={handleLogout}
                  className="group relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-pink-700 cursor-pointer"
                  title="Đăng xuất khỏi tài khoản"
                >
                  <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-base">Đăng xuất</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 text-base"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-base"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-3 pt-3 pb-4 space-y-2 sm:px-4 bg-gray-50 rounded-lg mt-3">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-3 block px-4 py-3 rounded-md text-base font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-blue-600 hover:bg-white"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {user ? (
                <>
                  <div className="flex items-center justify-between px-4 py-3 bg-white rounded-md ">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Level {user.level}
                      </div>
                      <div className="text-blue-600 font-semibold text-sm">
                        {user.xp} XP
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-xl font-medium w-full text-left hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 block px-4 py-3 rounded-md text-base font-medium hover:bg-white transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white block px-4 py-3 rounded-md text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
