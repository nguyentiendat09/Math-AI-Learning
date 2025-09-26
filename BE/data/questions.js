// Bộ câu hỏi toán học lớp 8 mẫu cho demo
const GRADE8_QUESTIONS = [
  // Cấp độ Cơ bản
  {
    id: 1,
    question: "Tính: 2x + 3 = 7",
    options: ["x = 1", "x = 2", "x = 3", "x = 4"],
    correctAnswer: 1, // index của đáp án đúng (x = 2)
    difficulty: "Cơ bản",
    topic: "Phương trình bậc nhất",
  },
  {
    id: 2,
    question: "Kết quả của (-3)² là:",
    options: ["-9", "9", "-6", "6"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Lũy thừa",
  },
  {
    id: 3,
    question: "Căn bậc hai của 16 là:",
    options: ["2", "4", "8", "16"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Căn bậc hai",
  },
  {
    id: 4,
    question: "Giải phương trình: x - 5 = 0",
    options: ["x = -5", "x = 0", "x = 5", "x = 10"],
    correctAnswer: 2,
    difficulty: "Cơ bản",
    topic: "Phương trình bậc nhất",
  },
  {
    id: 5,
    question: "Tính: 3 + 2 × 4",
    options: ["20", "11", "14", "10"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Thứ tự thực hiện phép tính",
  },
  {
    id: 6,
    question: "Biểu thức nào sau đây là đơn thức?",
    options: ["2x + 3", "x² - 1", "5x²y", "x + y - z"],
    correctAnswer: 2,
    difficulty: "Cơ bản",
    topic: "Đơn thức",
  },
  {
    id: 7,
    question: "Tính: √25",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    difficulty: "Cơ bản",
    topic: "Căn bậc hai",
  },
  {
    id: 8,
    question: "Kết quả của 2³ là:",
    options: ["6", "8", "9", "12"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Lũy thừa",
  },
  {
    id: 9,
    question: "Giải phương trình: 2x = 10",
    options: ["x = 2", "x = 5", "x = 8", "x = 20"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Phương trình bậc nhất",
  },
  {
    id: 10,
    question: "Bậc của đơn thức 3x²y³ là:",
    options: ["2", "3", "5", "6"],
    correctAnswer: 2,
    difficulty: "Cơ bản",
    topic: "Đơn thức",
  },
  {
    id: 11,
    question: "Phân tích đa thức x² - 4 thành nhân tử:",
    options: ["(x-2)(x+2)", "(x-4)(x+4)", "(x-2)²", "(x+2)²"],
    correctAnswer: 0,
    difficulty: "Cơ bản",
    topic: "Phân tích đa thức",
  },
  {
    id: 12,
    question: "Giá trị của x² khi x = -3 là:",
    options: ["-9", "9", "-6", "6"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Lũy thừa",
  },
  {
    id: 13,
    question: "Điều kiện xác định của √x là:",
    options: ["x > 0", "x ≥ 0", "x < 0", "x ≠ 0"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Căn bậc hai",
  },
  {
    id: 14,
    question: "Kết quả của (2x)² là:",
    options: ["2x²", "4x", "4x²", "8x"],
    correctAnswer: 2,
    difficulty: "Cơ bản",
    topic: "Lũy thừa",
  },
  {
    id: 15,
    question: "Tập nghiệm của phương trình x(x-1) = 0 là:",
    options: ["{0}", "{1}", "{0; 1}", "{-1; 0}"],
    correctAnswer: 2,
    difficulty: "Cơ bản",
    topic: "Phương trình tích",
  },

  // Cấp độ Trung bình
  {
    id: 16,
    question: "Giải phương trình: 3x - 2 = 2x + 5",
    options: ["x = 3", "x = 5", "x = 7", "x = 9"],
    correctAnswer: 2,
    difficulty: "Trung bình",
    topic: "Phương trình bậc nhất",
  },
  {
    id: 17,
    question: "Rút gọn biểu thức: (x + 2)² - (x - 1)²",
    options: ["6x + 3", "6x - 3", "4x + 5", "2x + 5"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Hằng đẳng thức",
  },
  {
    id: 18,
    question: "Tính: √48 - √27 + √12",
    options: ["√3", "2√3", "3√3", "4√3"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Căn bậc hai",
  },
  {
    id: 19,
    question: "Nghiệm của phương trình x² - 5x + 6 = 0 là:",
    options: [
      "x = 1; x = 6",
      "x = 2; x = 3",
      "x = -2; x = -3",
      "x = -1; x = -6",
    ],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Phương trình bậc hai",
  },
  {
    id: 20,
    question: "Phân tích thành nhân tử: x² - 2x - 8",
    options: ["(x-4)(x+2)", "(x-2)(x+4)", "(x-8)(x+1)", "(x-1)(x+8)"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Phân tích đa thức",
  },
  {
    id: 21,
    question: "Giá trị nhỏ nhất của biểu thức x² + 2x + 5 là:",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Giá trị lớn nhất, nhỏ nhất",
  },
  {
    id: 22,
    question: "Rút gọn: (2x - 1)(x + 3) - 2x²",
    options: ["5x - 3", "6x - 3", "4x - 3", "3x - 3"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Nhân đa thức",
  },
  {
    id: 23,
    question: "Điều kiện để √(x-1) có nghĩa là:",
    options: ["x > 1", "x ≥ 1", "x < 1", "x ≠ 1"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Căn bậc hai",
  },
  {
    id: 24,
    question: "Tính: (√5 + √3)(√5 - √3)",
    options: ["2", "8", "√15", "2√15"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Căn bậc hai",
  },
  {
    id: 25,
    question: "Giải bất phương trình: 2x - 3 > x + 1",
    options: ["x > 2", "x > 4", "x < 2", "x < 4"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Bất phương trình",
  },
  {
    id: 26,
    question: "Thương của phép chia x³ - 8 cho x - 2 là:",
    options: ["x² + 2x + 4", "x² - 2x + 4", "x² + 2x - 4", "x² - 2x - 4"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Chia đa thức",
  },
  {
    id: 27,
    question: "Đồ thị hàm số y = 2x - 1 đi qua điểm:",
    options: ["(0, 1)", "(1, 1)", "(0, -1)", "(-1, 0)"],
    correctAnswer: 2,
    difficulty: "Trung bình",
    topic: "Hàm số bậc nhất",
  },
  {
    id: 28,
    question: "Tích của hai nghiệm phương trình x² - 3x + 2 = 0 là:",
    options: ["1", "2", "3", "-2"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Phương trình bậc hai",
  },
  {
    id: 29,
    question: "Rút gọn: √72 + √18 - √32",
    options: ["2√2", "3√2", "4√2", "5√2"],
    correctAnswer: 2,
    difficulty: "Trung bình",
    topic: "Căn bậc hai",
  },
  {
    id: 30,
    question: "Nghiệm của phương trình √(x+1) = 3 là:",
    options: ["x = 8", "x = 9", "x = 10", "x = 2"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Phương trình chứa căn",
  },

  // Cấp độ Khó
  {
    id: 31,
    question: "Giải phương trình: (x-1)/(x+2) = (x+3)/(x-4) (x ≠ -2, x ≠ 4)",
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correctAnswer: 0,
    difficulty: "Khó",
    topic: "Phương trình chứa ẩn ở mẫu",
  },
  {
    id: 32,
    question: "Tìm giá trị lớn nhất của biểu thức P = -x² + 4x - 1",
    options: ["P = 2", "P = 3", "P = 4", "P = 5"],
    correctAnswer: 1,
    difficulty: "Khó",
    topic: "Giá trị lớn nhất, nhỏ nhất",
  },
  {
    id: 33,
    question: "Phân tích thành nhân tử: x⁴ - 5x² + 4",
    options: [
      "(x²-1)(x²-4)",
      "(x²-2)(x²-2)",
      "(x-1)(x+1)(x-2)(x+2)",
      "Cả A và C đều đúng",
    ],
    correctAnswer: 3,
    difficulty: "Khó",
    topic: "Phân tích đa thức",
  },
  {
    id: 34,
    question: "Giải hệ phương trình: {x + y = 5; xy = 6}",
    options: [
      "(2,3) và (3,2)",
      "(1,4) và (4,1)",
      "(-2,-3) và (-3,-2)",
      "Cả A và C",
    ],
    correctAnswer: 0,
    difficulty: "Khó",
    topic: "Hệ phương trình",
  },
  {
    id: 35,
    question: "Rút gọn: (√3 + √2)/(√3 - √2)",
    options: ["5 + 2√6", "5 - 2√6", "3 + 2√6", "3 - 2√6"],
    correctAnswer: 0,
    difficulty: "Khó",
    topic: "Căn bậc hai",
  },
  {
    id: 36,
    question:
      "Tìm m để phương trình x² - 2mx + m² - 1 = 0 có hai nghiệm phân biệt",
    options: ["m ∈ ℝ", "m ≠ 0", "Không tồn tại m", "m ∈ ∅"],
    correctAnswer: 0,
    difficulty: "Khó",
    topic: "Phương trình bậc hai có tham số",
  },
  {
    id: 37,
    question: "Giải phương trình: √(x+3) + √(x-1) = 4",
    options: ["x = 1", "x = 5", "x = 6", "x = 13"],
    correctAnswer: 2,
    difficulty: "Khó",
    topic: "Phương trình chứa căn",
  },
  {
    id: 38,
    question: "Tìm nghiệm nguyên của phương trình: x² + y² = 25",
    options: ["4 cặp nghiệm", "8 cặp nghiệm", "12 cặp nghiệm", "16 cặp nghiệm"],
    correctAnswer: 2,
    difficulty: "Khó",
    topic: "Phương trình nghiệm nguyên",
  },
  {
    id: 39,
    question: "Đường thẳng y = ax + b đi qua A(1,2) và B(3,8). Tìm a và b:",
    options: ["a = 2, b = 0", "a = 3, b = -1", "a = 3, b = 1", "a = 4, b = -2"],
    correctAnswer: 1,
    difficulty: "Khó",
    topic: "Hàm số bậc nhất",
  },
  {
    id: 40,
    question: "Tìm GTNN của A = (x+1)/(x²+1) với x ∈ ℝ",
    options: ["A = -1/2", "A = -1", "A = 1/2", "A = 0"],
    correctAnswer: 0,
    difficulty: "Khó",
    topic: "Giá trị lớn nhất, nhỏ nhất",
  },

  // Thêm 10 câu nữa để đủ 50 câu
  {
    id: 41,
    question: "Tính: (-2)³ × 3²",
    options: ["-72", "72", "-18", "18"],
    correctAnswer: 0,
    difficulty: "Cơ bản",
    topic: "Lũy thừa",
  },
  {
    id: 42,
    question: "Giải phương trình: |x - 2| = 3",
    options: ["x = 5", "x = -1", "x = 5 hoặc x = -1", "x = 1 hoặc x = 5"],
    correctAnswer: 2,
    difficulty: "Trung bình",
    topic: "Phương trình chứa dấu giá trị tuyệt đối",
  },
  {
    id: 43,
    question: "Hàm số y = -2x + 3 có hệ số góc là:",
    options: ["2", "-2", "3", "-3"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Hàm số bậc nhất",
  },
  {
    id: 44,
    question: "Tập xác định của hàm số y = 1/(x-3) là:",
    options: ["ℝ", "ℝ\\{3}", "ℝ\\{0}", "ℝ\\{-3}"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Hàm số",
  },
  {
    id: 45,
    question:
      "Cho tam giác vuông có hai cạnh góc vuông là 3 và 4. Cạnh huyền là:",
    options: ["5", "6", "7", "√7"],
    correctAnswer: 0,
    difficulty: "Cơ bản",
    topic: "Định lý Pythagore",
  },
  {
    id: 46,
    question: "Diện tích hình vuông có cạnh √8 là:",
    options: ["4", "8", "16", "2√2"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Hình học",
  },
  {
    id: 47,
    question: "Giải bất phương trình: -2x + 6 ≥ 0",
    options: ["x ≤ 3", "x ≥ 3", "x ≤ -3", "x ≥ -3"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Bất phương trình",
  },
  {
    id: 48,
    question: "Tính chu vi hình tròn có bán kính 7cm (lấy π ≈ 22/7):",
    options: ["22 cm", "44 cm", "14 cm", "28 cm"],
    correctAnswer: 1,
    difficulty: "Cơ bản",
    topic: "Hình học",
  },
  {
    id: 49,
    question: "Hai đường thẳng y = 2x + 1 và y = 2x - 3 là:",
    options: ["Trùng nhau", "Song song", "Cắt nhau", "Vuông góc"],
    correctAnswer: 1,
    difficulty: "Trung bình",
    topic: "Hàm số bậc nhất",
  },
  {
    id: 50,
    question: "Tìm x biết: x² - 6x + 9 = 0",
    options: ["x = 3", "x = -3", "x = ±3", "Vô nghiệm"],
    correctAnswer: 0,
    difficulty: "Trung bình",
    topic: "Phương trình bậc hai",
  },
];

// Hàm random câu hỏi theo yêu cầu
const getRandomQuestions = (count, difficulty = null) => {
  let filteredQuestions = GRADE8_QUESTIONS;

  // Lọc theo độ khó nếu có
  if (difficulty && difficulty !== "Tất cả") {
    filteredQuestions = GRADE8_QUESTIONS.filter(
      (q) => q.difficulty === difficulty
    );
  }

  // Trộn ngẫu nhiên
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());

  // Lấy số câu yêu cầu
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Hàm lấy thống kê câu hỏi
const getQuestionStats = () => {
  const stats = {
    total: GRADE8_QUESTIONS.length,
    byDifficulty: {
      "Cơ bản": GRADE8_QUESTIONS.filter((q) => q.difficulty === "Cơ bản")
        .length,
      "Trung bình": GRADE8_QUESTIONS.filter(
        (q) => q.difficulty === "Trung bình"
      ).length,
      Khó: GRADE8_QUESTIONS.filter((q) => q.difficulty === "Khó").length,
    },
    topics: [...new Set(GRADE8_QUESTIONS.map((q) => q.topic))],
  };
  return stats;
};

module.exports = {
  GRADE8_QUESTIONS,
  getRandomQuestions,
  getQuestionStats,
};
