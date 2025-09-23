import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  Filter,
} from "lucide-react";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'weekly', 'monthly'
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/leaderboard");
      setLeaderboard(response.data);

      // Find current user's rank
      const currentUserRank =
        response.data.findIndex((entry) => entry.name === user?.name) + 1;
      setUserRank(currentUserRank || null);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRankBadgeStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressWidth = (xp, maxXp) => {
    return maxXp > 0 ? Math.min((xp / maxXp) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const maxXP = leaderboard.length > 0 ? leaderboard[0].xp : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bảng xếp hạng
          </h1>
          <p className="text-gray-600">
            Cùng cạnh tranh và học tập với các bạn khác!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Thứ hạng</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select py-1 px-3 text-sm"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="weekly">Tuần này</option>
                <option value="monthly">Tháng này</option>
              </select>
            </div>
          </div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="mb-8">
              <div className="flex items-end justify-center space-x-8 mb-6 px-4">
                {/* 2nd Place */}
                <div className="text-center flex flex-col items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-white font-bold text-lg md:text-xl">
                      2
                    </span>
                  </div>
                  <div className="bg-gray-100 p-3 md:p-4 rounded-lg w-28 md:w-32 min-h-[100px] flex flex-col justify-center items-center shadow-md">
                    <div className="font-semibold text-gray-900 text-sm md:text-base text-center line-clamp-2">
                      {leaderboard[1].name}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      Level {leaderboard[1].level}
                    </div>
                    <div className="text-xs md:text-sm text-blue-600 font-semibold mt-1">
                      {leaderboard[1].xp} XP
                    </div>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center flex flex-col items-center">
                  <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-white font-bold text-xl md:text-2xl">
                      1
                    </span>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-200 p-3 md:p-4 rounded-lg w-32 md:w-36 min-h-[120px] flex flex-col justify-center items-center shadow-lg">
                    <div className="font-bold text-gray-900 text-sm md:text-lg text-center line-clamp-2">
                      {leaderboard[0].name}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      Level {leaderboard[0].level}
                    </div>
                    <div className="text-xs md:text-sm text-yellow-600 font-bold mt-1">
                      {leaderboard[0].xp} XP
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      🏆 Quán quân
                    </div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center flex flex-col items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-white font-bold text-lg md:text-xl">
                      3
                    </span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 md:p-4 rounded-lg w-28 md:w-32 min-h-[100px] flex flex-col justify-center items-center shadow-md">
                    <div className="font-semibold text-gray-900 text-sm md:text-base text-center line-clamp-2">
                      {leaderboard[2].name}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      Level {leaderboard[2].level}
                    </div>
                    <div className="text-xs md:text-sm text-amber-600 font-semibold mt-1">
                      {leaderboard[2].xp} XP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg transition-all ${
                  entry.name === user?.name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Rank */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${getRankBadgeStyle(
                        entry.rank
                      )}`}
                    >
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className="text-lg">{entry.rank}</span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {entry.name}
                        </h3>
                        {entry.name === user?.name && (
                          <span className="badge badge-primary text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>Level {entry.level}</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-1 text-green-500" />
                          <span>{entry.completedTopics || 0} chủ đề</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* XP and Progress */}
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {entry.xp} XP
                    </div>
                    <div className="w-24 md:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{
                          width: `${getProgressWidth(entry.xp, maxXP)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((entry.xp / maxXP) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Stats */}
        {userRank && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card text-center p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">#{userRank}</div>
              <div className="text-xs text-gray-600">Thứ hạng của bạn</div>
            </div>

            <div className="card text-center p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {user?.xp || 0}
              </div>
              <div className="text-xs text-gray-600">Điểm XP</div>
            </div>

            <div className="card text-center p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {leaderboard.length}
              </div>
              <div className="text-xs text-gray-600">Tổng người chơi</div>
            </div>
          </div>
        )}

        {/* Achievements Board */}
        <div className="card">
          <h2 className="card-title mb-6">🏆 Thành tích nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-yellow-800 mb-2">
                Học viên xuất sắc nhất
              </h3>
              <p className="text-yellow-700">
                {leaderboard.length > 0 ? leaderboard[0].name : "Chưa có"}
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                {leaderboard.length > 0 ? `${leaderboard[0].xp} XP` : ""}
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">
                Người hoàn thành nhiều nhất
              </h3>
              <p className="text-green-700">
                {leaderboard.length > 0
                  ? leaderboard.reduce((max, current) =>
                      current.completedTopics > max.completedTopics
                        ? current
                        : max
                    ).name
                  : "Chưa có"}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {leaderboard.length > 0
                  ? `${
                      leaderboard.reduce((max, current) =>
                        current.completedTopics > max.completedTopics
                          ? current
                          : max
                      ).completedTopics
                    } chủ đề`
                  : ""}
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">
                Người học tích cực nhất
              </h3>
              <p className="text-purple-700">Nguyễn Văn A</p>
              <p className="text-sm text-purple-600 mt-1">30 ngày streak</p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💪 Hãy tiếp tục cố gắng!
          </h3>
          <p className="text-gray-600">
            {userRank && userRank <= 3
              ? "Bạn đang trong top 3! Hãy duy trì phong độ nhé!"
              : userRank
              ? `Bạn đang xếp hạng ${userRank}. Học thêm để cải thiện thứ hạng!`
              : "Hãy bắt đầu học để xuất hiện trên bảng xếp hạng!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
