import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Play,
  BookOpen,
  Users,
  Trophy,
  Zap,
  Star,
  ArrowRight,
  Brain,
  Map,
  Target,
  ChevronUp,
} from "lucide-react";

// Component CountUp cho hiệu ứng đếm số
const CountUp = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOut cubic
      setCount(Math.floor(end * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Component BackToTop
const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ${
        showButton
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
};

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI Thông Minh",
      description: "Giải thích cá nhân hóa và tạo bài tập phù hợp với trình độ",
    },
    {
      icon: Map,
      title: "Bản Đồ Học Tập",
      description: "Hành trình học tập trực quan với system unlock chủ đề",
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Huy hiệu, level, XP và bảng xếp hạng thúc đẩy học tập",
    },
    {
      icon: Target,
      title: "Thực Tiễn",
      description: "Kết nối toán học với cuộc sống và ứng dụng thực tế",
    },
  ];

  const demoTopics = [
    {
      id: 1,
      title: "Số nguyên",
      description: "Khám phá thế giới số âm và số dương",
      level: "Lớp 6",
      icon: "🔢",
    },
    {
      id: 2,
      title: "Phân số",
      description: "Hiểu về các phần của một tổng thể",
      level: "Lớp 6",
      icon: "🍕",
    },
    {
      id: 3,
      title: "Định lý Pythagore",
      description: "Khám phá mối quan hệ giữa các cạnh tam giác vuông",
      level: "Lớp 8",
      icon: "📐",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white section-spacing-md">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-spacing">
            <h1 className="text-4xl md:text-6xl font-bold">
              AI + Toán học =
              <span className="block text-yellow-300 mt-4">
                Khám phá đầy hứng thú
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Hành trình học toán thông qua lịch sử, kiến thức và ứng dụng thực
              tiễn với sự hỗ trợ của AI
            </p>

            {/* Video Player Mock */}
            <div className="content-spacing max-w-4xl mx-auto">
              <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-20 w-20 text-white mb-4 mx-auto opacity-80" />
                    <p className="text-white text-lg">
                      Video giới thiệu MathAI Learning
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      Giáo viên AI sẽ dẫn dắt bạn khám phá toán học
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center element-spacing">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn-primary inline-flex items-center text-lg px-8 py-4"
                >
                  <Target className="h-6 w-6 mr-2" />
                  Tiếp tục hành trình
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center text-lg px-8 py-4"
                >
                  🚀 Bắt đầu hành trình
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing-lg bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center content-spacing text-spacing">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tại sao chọn MathAI Learning?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto last-child">
              Chúng tôi kết hợp công nghệ AI tiên tiến với phương pháp giảng dạy
              hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-spacing-lg card-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="card text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto element-spacing">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 tight-spacing">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 last-child">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Topics Section */}
      <section className="section-spacing-lg bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center content-spacing text-spacing">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trải nghiệm nhanh
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto last-child">
              Khám phá một số chủ đề toán học hấp dẫn (Dành cho khách)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-spacing-lg card-grid">
            {demoTopics.map((topic, index) => (
              <div
                key={topic.id}
                className="card hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-6xl element-spacing">{topic.icon}</div>
                  <div className="badge badge-primary tight-spacing">
                    {topic.level}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 tight-spacing">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 element-spacing">
                    {topic.description}
                  </p>
                  {user ? (
                    <Link
                      to={`/topic/${topic.id}`}
                      className="btn-primary inline-flex items-center"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Học ngay
                    </Link>
                  ) : (
                    <div>
                      <button className="btn-secondary mb-2" disabled>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Xem demo
                      </button>
                      <p className="text-sm text-gray-500">
                        <Link
                          to="/register"
                          className="text-blue-600 hover:underline"
                        >
                          Đăng ký
                        </Link>{" "}
                        để trải nghiệm đầy đủ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-spacing-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stats-item">
              <div className="text-4xl md:text-5xl font-bold tight-spacing">
                <CountUp end={50} suffix="+" />
              </div>
              <div className="text-blue-100 text-lg">Chủ đề toán học</div>
            </div>
            <div className="stats-item">
              <div className="text-4xl md:text-5xl font-bold tight-spacing">
                <CountUp end={1000} suffix="+" />
              </div>
              <div className="text-blue-100 text-lg">Học sinh đã tham gia</div>
            </div>
            <div className="stats-item">
              <div className="text-4xl md:text-5xl font-bold tight-spacing">
                <CountUp end={95} suffix="%" />
              </div>
              <div className="text-blue-100 text-lg">Học sinh hài lòng</div>
            </div>
            <div className="stats-item">
              <div className="text-4xl md:text-5xl font-bold tight-spacing">
                24/7
              </div>
              <div className="text-blue-100 text-lg">Hỗ trợ AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing-lg bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-spacing">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Sẵn sàng bắt đầu hành trình khám phá toán học?
          </h2>

          <p className="text-xl text-gray-600 element-spacing">
            Tham gia cùng hàng nghìn học sinh đã tin tưởng MathAI Learning
          </p>

          {!user && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center text-lg px-8 py-4"
                >
                  <Users className="h-6 w-6 mr-2" />
                  Đăng ký miễn phí
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                <Link
                  to="/demo"
                  className="btn-secondary inline-flex items-center text-lg px-8 py-4"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Trải nghiệm Demo
                </Link>
              </div>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 block"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Home;
