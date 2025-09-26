const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { getRandomQuestions, getQuestionStats } = require("./data/questions");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());

// In-memory database (replace with actual database in production)
let users = [];
let classes = [];
let assignments = []; // Add assignments storage

// Initialize demo accounts
async function initializeDemoAccounts() {
  try {
    // Hash passwords for demo accounts
    const hashedPassword = await bcrypt.hash("demo123", 10);
    const teacherPassword = await bcrypt.hash("teacher123", 10);

    // Demo student account
    const demoStudent = {
      id: "demo-student-001",
      name: "Học sinh Demo",
      email: "student@demo.com",
      password: hashedPassword,
      role: "student",
      level: 3,
      xp: 150,
      completedTopics: [1, 2],
      badges: ["Beginner", "Quick Learner"],
      createdAt: new Date().toISOString(),
    };

    // Demo teacher account
    const demoTeacher = {
      id: "demo-teacher-001",
      name: "Giáo viên Demo",
      email: "teacher@demo.com",
      password: teacherPassword,
      role: "teacher",
      level: 10,
      xp: 1000,
      classes: ["demo-class-001"],
      createdAt: new Date().toISOString(),
    };

    // Add demo accounts if they don't exist
    if (!users.find((u) => u.email === demoStudent.email)) {
      users.push(demoStudent);
    }
    if (!users.find((u) => u.email === demoTeacher.email)) {
      users.push(demoTeacher);
    }

    console.log("Demo accounts initialized:");
    console.log("Student: student@demo.com / demo123");
    console.log("Teacher: teacher@demo.com / teacher123");
  } catch (error) {
    console.error("Error initializing demo accounts:", error);
  }
}

// Initialize demo data with diverse students, classes, and assignments
async function initializeDemoData() {
  try {
    const studentPassword = await bcrypt.hash("student123", 10);

    // Add more diverse students with different profiles
    const diverseStudents = [
      {
        id: "student-001",
        name: "Nguyễn Văn An",
        email: "an.nguyen@demo.com",
        password: studentPassword,
        role: "student",
        level: 4,
        xp: 320,
        completedTopics: [1, 2, 3],
        badges: ["Beginner", "Quick Learner", "Math Explorer"],
        createdAt: new Date().toISOString(),
        lastActive: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        class: "Lớp 6A - Toán Nâng Cao",
      },
      {
        id: "student-002",
        name: "Trần Thị Bình",
        email: "binh.tran@demo.com",
        password: studentPassword,
        role: "student",
        level: 3,
        xp: 280,
        completedTopics: [1, 2],
        badges: ["Beginner", "Persistent"],
        createdAt: new Date().toISOString(),
        lastActive: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        class: "Lớp 6A - Toán Nâng Cao",
      },
      {
        id: "student-003",
        name: "Lê Minh Châu",
        email: "chau.le@demo.com",
        password: studentPassword,
        role: "student",
        level: 5,
        xp: 450,
        completedTopics: [1, 2, 3, 4, 5],
        badges: ["Beginner", "Quick Learner", "Math Explorer", "Advanced"],
        createdAt: new Date().toISOString(),
        lastActive: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        class: "Lớp 7B - Đại Số Cơ Bản",
      },
      {
        id: "student-004",
        name: "Phạm Đức Dũng",
        email: "dung.pham@demo.com",
        password: studentPassword,
        role: "student",
        level: 2,
        xp: 150,
        completedTopics: [1],
        badges: ["Beginner"],
        createdAt: new Date().toISOString(),
        lastActive: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        class: "Lớp 7B - Đại Số Cơ Bản",
      },
      {
        id: "student-005",
        name: "Võ Thị Mai",
        email: "mai.vo@demo.com",
        password: studentPassword,
        role: "student",
        level: 6,
        xp: 580,
        completedTopics: [1, 2, 3, 4, 5, 6],
        badges: [
          "Beginner",
          "Quick Learner",
          "Math Explorer",
          "Advanced",
          "Expert",
        ],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        class: "Lớp 8C - Hình Học Không Gian",
      },
      {
        id: "student-006",
        name: "Ngô Tuấn Kiệt",
        email: "kiet.ngo@demo.com",
        password: studentPassword,
        role: "student",
        level: 1,
        xp: 50,
        completedTopics: [],
        badges: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        class: "Lớp 6A - Toán Nâng Cao",
      },
    ];

    // Add students if they don't exist
    diverseStudents.forEach((student) => {
      if (!users.find((u) => u.email === student.email)) {
        users.push(student);
      }
    });

    // Add demo classes if they don't exist
    if (classes.length === 0) {
      classes.push(
        {
          id: "class-001",
          name: "Lớp 6A - Toán Nâng Cao",
          description: "Lớp toán nâng cao dành cho học sinh giỏi lớp 6",
          grade: "6",
          subject: "Toán học",
          teacherId: "demo-teacher-001",
          studentIds: ["demo-student-001", "student-001", "student-002"],
          createdAt: new Date().toISOString(),
          schedule: "Thứ 2, 4, 6 - 14:00-15:30",
          studentCount: 3,
        },
        {
          id: "class-002",
          name: "Lớp 7B - Đại Số Cơ Bản",
          description: "Lớp đại số cơ bản cho học sinh lớp 7",
          grade: "7",
          subject: "Toán học",
          teacherId: "demo-teacher-001",
          studentIds: ["student-003", "student-004"],
          createdAt: new Date().toISOString(),
          schedule: "Thứ 3, 5, 7 - 15:30-17:00",
          studentCount: 2,
        },
        {
          id: "class-003",
          name: "Lớp 8C - Hình Học Không Gian",
          description: "Khám phá thế giới hình học 3D",
          grade: "8",
          subject: "Hình học",
          teacherId: "demo-teacher-001",
          studentIds: [],
          createdAt: new Date().toISOString(),
          schedule: "Thứ 2, 4 - 16:00-17:30",
          studentCount: 0,
        }
      );
    }

    // Add demo assignments if they don't exist
    if (assignments.length === 0) {
      assignments.push(
        {
          id: "assign-001",
          title: "Bài tập Phân số",
          description: "Luyện tập các phép tính với phân số",
          classId: "class-001",
          teacherId: "demo-teacher-001",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          questions: [
            {
              id: 1,
              question: "Tính: 1/2 + 1/3 = ?",
              options: ["2/5", "5/6", "1/6", "3/5"],
              correctAnswer: 1,
              points: 10,
            },
            {
              id: 2,
              question: "Rút gọn phân số: 12/18",
              options: ["2/3", "3/4", "1/2", "4/5"],
              correctAnswer: 0,
              points: 10,
            },
          ],
          submissions: [
            {
              studentId: "demo-student-001",
              answers: [1, 0],
              score: 20,
              submittedAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: "assign-002",
          title: "Quiz Hình học",
          description: "Kiểm tra kiến thức về tam giác",
          classId: "class-002",
          teacherId: "demo-teacher-001",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          questions: [
            {
              id: 1,
              question: "Tổng các góc trong tam giác bằng bao nhiêu độ?",
              options: ["90°", "180°", "270°", "360°"],
              correctAnswer: 1,
              points: 15,
            },
            {
              id: 2,
              question: "Tam giác đều có mấy cạnh bằng nhau?",
              options: ["1", "2", "3", "4"],
              correctAnswer: 2,
              points: 15,
            },
          ],
          submissions: [],
        },
        {
          id: "assign-003",
          title: "Bài tập Đại số",
          description: "Giải phương trình bậc nhất",
          classId: "class-002",
          teacherId: "demo-teacher-001",
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          questions: [
            {
              id: 1,
              question: "Giải phương trình: 2x + 5 = 11",
              options: ["x = 2", "x = 3", "x = 4", "x = 5"],
              correctAnswer: 1,
              points: 20,
            },
          ],
          submissions: [
            {
              studentId: "student-003",
              answers: [1],
              score: 20,
              submittedAt: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              studentId: "student-004",
              answers: [0],
              score: 0,
              submittedAt: new Date(
                Date.now() - 12 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
        }
      );
    }

    console.log("Demo data initialized:");
    console.log(`- ${users.length} users`);
    console.log(`- ${classes.length} classes`);
    console.log(`- ${assignments.length} assignments`);
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}

let topics = [
  {
    id: 1,
    title: "Số nguyên",
    description: "Khám phá thế giới số âm và số dương",
    level: "Lớp 6",
    category: "Đại số",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history:
      "Số nguyên được phát minh từ thời cổ đại để giải quyết các bài toán nợ và nhiệt độ. Người Ấn Độ cổ đại đã sử dụng số âm từ thế kỷ 7.",
    knowledge:
      "Số nguyên bao gồm số âm, số 0 và số dương. Chúng được biểu diễn trên trục số và có thể thực hiện các phép toán cộng, trừ, nhân, chia.",
    application:
      "Ứng dụng trong nhiệt độ (âm/dương), độ cao so với mực nước biển, tài chính (lãi/lỗ), và trong lập trình máy tính.",
    customVideos: [],
    classAssignments: [],
    quiz: [
      {
        question: "Số nào sau đây là số nguyên âm?",
        options: ["-5", "0", "3", "2.5"],
        correctAnswer: 0,
        explanation:
          "Số nguyên âm là số nhỏ hơn 0, trong trường hợp này là -5.",
      },
      {
        question: "Kết quả của phép tính (-3) + 5 là:",
        options: ["-8", "2", "-2", "8"],
        correctAnswer: 1,
        explanation: "(-3) + 5 = 5 - 3 = 2",
      },
    ],
    xp: 100,
    prerequisites: [],
  },
  {
    id: 2,
    title: "Phân số",
    description: "Hiểu về các phần của một tổng thể",
    level: "Lớp 6",
    category: "Đại số",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history:
      "Phân số được sử dụng từ thời Ai Cập cổ đại (khoảng 1800 TCN) để chia bánh mì và đo lường đất đai.",
    knowledge:
      "Phân số biểu diễn một phần của tổng thể, gồm tử số (trên) và mẫu số (dưới). Có thể rút gọn, so sánh và thực hiện phép toán.",
    application:
      "Chia sẻ bánh pizza, tính tỷ lệ trong nấu ăn, đo lường trong xây dựng, tính phần trăm trong kinh doanh.",
    customVideos: [],
    classAssignments: [],
    quiz: [
      {
        question: "3/4 bằng bao nhiêu phần trăm?",
        options: ["75%", "34%", "43%", "25%"],
        correctAnswer: 0,
        explanation: "3/4 = 0.75 = 75%",
      },
      {
        question: "Phân số nào lớn hơn: 2/3 hay 3/4?",
        options: ["2/3", "3/4", "Bằng nhau", "Không so sánh được"],
        correctAnswer: 1,
        explanation: "3/4 = 0.75 và 2/3 ≈ 0.67, nên 3/4 > 2/3",
      },
    ],
    xp: 120,
    prerequisites: [1],
  },
  {
    id: 3,
    title: "Định lý Pythagore",
    description: "Khám phá mối quan hệ giữa các cạnh tam giác vuông",
    level: "Lớp 8",
    category: "Hình học",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history:
      "Pythagore phát hiện định lý này từ thế kỷ 6 TCN, mặc dù người Babylon đã biết trước đó 1000 năm.",
    knowledge:
      "a² + b² = c² trong tam giác vuông, với c là cạnh huyền và a, b là hai cạnh góc vuông.",
    application:
      "Xây dựng nhà cửa, định vị GPS, thiết kế cầu thang, đo khoảng cách trong không gian 3D.",
    customVideos: [],
    classAssignments: [],
    quiz: [
      {
        question:
          "Trong tam giác vuông có hai cạnh góc vuông là 3 và 4, cạnh huyền bằng:",
        options: ["5", "7", "6", "8"],
        correctAnswer: 0,
        explanation:
          "Theo định lý Pythagore: c² = 3² + 4² = 9 + 16 = 25, nên c = 5",
      },
      {
        question: "Định lý Pythagore chỉ áp dụng cho:",
        options: [
          "Tam giác thường",
          "Tam giác vuông",
          "Tam giác cân",
          "Tất cả tam giác",
        ],
        correctAnswer: 1,
        explanation: "Định lý Pythagore chỉ áp dụng cho tam giác vuông.",
      },
    ],
    xp: 150,
    prerequisites: [1, 2],
  },
  {
    id: 4,
    title: "Xác suất cơ bản",
    description: "Tính toán khả năng xảy ra của các sự kiện",
    level: "Lớp 7",
    category: "Thống kê",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    history:
      "Lý thuyết xác suất bắt đầu từ thế kỷ 17 với Pascal và Fermat nghiên cứu trò chơi may rủi.",
    knowledge:
      "Xác suất = Số kết quả thuận lợi / Tổng số kết quả có thể. Giá trị từ 0 đến 1.",
    application:
      "Dự báo thời tiết, bảo hiểm, trò chơi, thống kê y học, đầu tư tài chính.",
    quiz: [
      {
        question: "Xác suất tung được mặt sấp khi tung đồng xu là:",
        options: ["1/4", "1/2", "1/3", "1"],
        correctAnswer: 1,
        explanation:
          "Có 2 kết quả có thể (sấp, ngửa), 1 kết quả thuận lợi (sấp), nên P = 1/2",
      },
    ],
    xp: 130,
    prerequisites: [2],
  },
];
let progress = [];
let achievements = [];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Check if user exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role: role || "student",
      name,
      createdAt: new Date(),
      level: 1,
      xp: 0,
      achievements: [],
    };

    users.push(user);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Topics Routes
app.get("/api/topics", (req, res) => {
  try {
    const { level, category } = req.query;
    let filteredTopics = topics;

    if (level) {
      filteredTopics = filteredTopics.filter((topic) => topic.level === level);
    }

    if (category) {
      filteredTopics = filteredTopics.filter(
        (topic) => topic.category === category
      );
    }

    res.json(filteredTopics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/topics/:id", (req, res) => {
  try {
    const topicId = parseInt(req.params.id);
    const topic = topics.find((t) => t.id === topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Progress Routes
app.get("/api/progress", authenticateToken, (req, res) => {
  try {
    const userProgress = progress.filter((p) => p.userId === req.user.userId);
    res.json(userProgress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/progress", authenticateToken, (req, res) => {
  try {
    const { topicId, completed, score } = req.body;

    // Check if progress already exists
    const existingProgress = progress.find(
      (p) => p.userId === req.user.userId && p.topicId === topicId
    );

    if (existingProgress) {
      existingProgress.completed = completed;
      existingProgress.score = Math.max(existingProgress.score, score);
      existingProgress.updatedAt = new Date();
    } else {
      const newProgress = {
        id: uuidv4(),
        userId: req.user.userId,
        topicId,
        completed,
        score,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      progress.push(newProgress);
    }

    // Update user XP
    const topic = topics.find((t) => t.id === topicId);
    if (topic && completed) {
      const user = users.find((u) => u.id === req.user.userId);
      if (user) {
        user.xp += topic.xp;
        user.level = Math.floor(user.xp / 500) + 1;
      }
    }

    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// AI Routes
app.post("/api/ai/generate-quiz", (req, res) => {
  try {
    const { topic, level, numQuestions, difficulty } = req.body;

    console.log("📚 Quiz generation request:", {
      topic,
      level,
      numQuestions,
      difficulty,
    });

    // Validate input
    const requestedCount = parseInt(numQuestions) || 5;
    const maxQuestions = Math.min(requestedCount, 20); // Limit max to 20 questions

    // Map difficulty from frontend to backend format
    let mappedDifficulty = null;
    if (level === "Cơ bản") mappedDifficulty = "Cơ bản";
    else if (level === "Trung bình") mappedDifficulty = "Trung bình";
    else if (level === "Khó") mappedDifficulty = "Khó";

    // Get random questions from our question bank
    const selectedQuestions = getRandomQuestions(
      maxQuestions,
      mappedDifficulty
    );

    // Format questions for frontend
    const formattedQuiz = selectedQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: `Đáp án đúng: ${q.options[q.correctAnswer]}. Chủ đề: ${
        q.topic
      }`,
      difficulty: q.difficulty,
      topic: q.topic,
    }));

    // Get stats for additional info
    const stats = getQuestionStats();

    console.log("✅ Generated quiz:", {
      questionsGenerated: formattedQuiz.length,
      difficulty: mappedDifficulty || "Tất cả",
      availableQuestions: stats.total,
    });

    res.json({
      message: "Quiz generated successfully",
      quiz: formattedQuiz,
      metadata: {
        totalQuestions: formattedQuiz.length,
        difficulty: mappedDifficulty || "Tất cả",
        topics: [...new Set(formattedQuiz.map((q) => q.topic))],
        stats: stats,
      },
    });
  } catch (error) {
    console.error("❌ Quiz generation error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      fallback: "Không thể tạo quiz. Vui lòng thử lại.",
    });
  }
});

// AI Chat endpoint
app.post("/api/ai/chat", (req, res) => {
  try {
    const { message, history } = req.body;

    // Smart AI response based on message content
    let aiResponse = "";
    const lowerMessage = message.toLowerCase();

    // Math topics responses
    if (lowerMessage.includes("phân số") || lowerMessage.includes("phan so")) {
      aiResponse = `📊 **Phân số - Kiến thức cơ bản:**

🔢 **Định nghĩa:** Phân số a/b biểu diễn phép chia a cho b (b ≠ 0)
• Tử số (a): Số bị chia
• Mẫu số (b): Số chia

📝 **Các phép toán cơ bản:**
• Cộng: a/c + b/c = (a+b)/c
• Trừ: a/c - b/c = (a-b)/c  
• Nhân: a/b × c/d = (a×c)/(b×d)
• Chia: a/b ÷ c/d = a/b × d/c = (a×d)/(b×c)

💡 **Ví dụ:** 2/3 + 1/3 = 3/3 = 1

Bạn muốn tôi tạo bài tập về phân số không? 🤔`;
    } else if (
      lowerMessage.includes("phương trình") ||
      lowerMessage.includes("phuong trinh")
    ) {
      aiResponse = `📐 **Phương trình bậc nhất:**

🎯 **Dạng tổng quát:** ax + b = 0 (a ≠ 0)
**Nghiệm:** x = -b/a

📚 **Các bước giải:**
1️⃣ Chuyển vế (đổi dấu khi chuyển)
2️⃣ Thu gọn hai vế  
3️⃣ Chia cả hai vế cho hệ số của x

💡 **Ví dụ:** 2x + 6 = 0
• Chuyển vế: 2x = -6
• Chia cho 2: x = -3

🔍 **Phương trình bậc hai:** ax² + bx + c = 0
• Δ = b² - 4ac
• Nếu Δ > 0: x = (-b ± √Δ)/(2a)

Có câu hỏi nào về phương trình không? 🧮`;
    } else if (
      lowerMessage.includes("hình học") ||
      lowerMessage.includes("hinh hoc")
    ) {
      aiResponse = `📐 **Hình học - Công thức cơ bản:**

🔷 **Hình chữ nhật:**
• Diện tích: S = a × b
• Chu vi: P = 2(a + b)

🔶 **Hình vuông:**  
• Diện tích: S = a²
• Chu vi: P = 4a

🔵 **Hình tròn:**
• Diện tích: S = πr²
• Chu vi: C = 2πr

🔺 **Tam giác:**
• Diện tích: S = (1/2) × đáy × chiều cao
• Định lý Pythagore: a² + b² = c²

📊 **Hình thang:**
• Diện tích: S = (1/2)(a + b) × h

Bạn cần giải bài tập hình học nào? 📝`;
    } else if (
      lowerMessage.includes("căn bậc hai") ||
      lowerMessage.includes("can bac hai")
    ) {
      aiResponse = `🔢 **Căn bậc hai:**

📖 **Định nghĩa:** √a là số x sao cho x² = a (a ≥ 0)

⚡ **Tính chất:**
• √(a²) = |a|
• √(ab) = √a × √b
• √(a/b) = √a / √b

🎯 **Công thức quan trọng:**
• (√a + √b)² = a + 2√(ab) + b
• (√a - √b)² = a - 2√(ab) + b
• (√a + √b)(√a - √b) = a - b

💡 **Ví dụ rút gọn:**
• √12 = √(4×3) = 2√3
• √50 = √(25×2) = 5√2

🔍 **Điều kiện:** √a có nghĩa khi a ≥ 0

Cần giải thích thêm về căn thức không? 🤓`;
    } else if (
      lowerMessage.includes("bài tập") ||
      lowerMessage.includes("tạo") ||
      lowerMessage.includes("quiz")
    ) {
      const stats = getQuestionStats();
      aiResponse = `🎯 **Tôi có thể tạo bài tập cho bạn!**

📚 **Ngân hàng câu hỏi hiện có:**
• 📊 Tổng: ${stats.total} câu hỏi
• 🟢 Cơ bản: ${stats.byDifficulty["Cơ bản"]} câu
• 🟡 Trung bình: ${stats.byDifficulty["Trung bình"]} câu  
• 🔴 Khó: ${stats.byDifficulty["Khó"]} câu

🏷️ **Chủ đề có sẵn:**
${stats.topics.map((topic) => `• ${topic}`).join("\n")}

💡 **Cách sử dụng:**
1️⃣ Vào tab "Quiz Generator" 
2️⃣ Chọn chủ đề và độ khó
3️⃣ Chọn số câu hỏi (1-20)
4️⃣ Nhấn "Tạo Quiz"

🎮 **Hoặc hỏi trực tiếp:** "Tạo 5 câu về phương trình cơ bản"`;
    } else if (
      lowerMessage.includes("lũy thừa") ||
      lowerMessage.includes("luy thua")
    ) {
      aiResponse = `⚡ **Lũy thừa:**

📖 **Định nghĩa:** aⁿ = a × a × ... × a (n lần)

🔢 **Quy tắc tính:**
• a⁰ = 1 (a ≠ 0)
• a¹ = a
• aᵐ × aⁿ = aᵐ⁺ⁿ
• aᵐ ÷ aⁿ = aᵐ⁻ⁿ
• (aᵐ)ⁿ = aᵐˣⁿ
• (ab)ⁿ = aⁿbⁿ

💡 **Lũy thừa âm:**
• a⁻ⁿ = 1/aⁿ
• Ví dụ: 2⁻³ = 1/2³ = 1/8

🎯 **Ví dụ:**
• 2³ = 8
• 3² × 3⁴ = 3⁶ = 729
• (2³)² = 2⁶ = 64

Cần giải bài tập về lũy thừa không? 🚀`;
    } else if (
      lowerMessage.includes("giúp") ||
      lowerMessage.includes("help") ||
      lowerMessage.includes("hỗ trợ")
    ) {
      aiResponse = `🤖 **AI Toán học - Trợ lý học tập của bạn!**

🎯 **Tôi có thể giúp bạn:**

📚 **Giải thích lý thuyết:**
• Phân số, thập phân, phần trăm
• Phương trình, bất phương trình  
• Hình học phẳng, hình không gian
• Căn bậc hai, lũy thừa
• Hàm số, đồ thị

🧮 **Hướng dẫn giải bài:**
• Từng bước chi tiết
• Mẹo và công thức nhanh
• Cách tránh sai lầm thường gặp

🎮 **Tạo bài tập:**
• Quiz trắc nghiệm tự động
• Phân loại theo độ khó
• Giải thích đáp án chi tiết

💡 **Cách sử dụng hiệu quả:**
1️⃣ Hỏi cụ thể: "Giải phương trình 2x + 5 = 11"
2️⃣ Yêu cầu giải thích: "Căn bậc hai là gì?"
3️⃣ Tạo bài tập: "Tạo 5 câu về hình học"

Bạn muốn bắt đầu với chủ đề nào? 😊`;
    } else if (
      lowerMessage.includes("giải") &&
      lowerMessage.includes("phương trình")
    ) {
      aiResponse = `🔍 **Giải phương trình bước by bước:**

Hãy cho tôi phương trình cụ thể, ví dụ:
• "Giải 2x + 3 = 7"
• "Giải x² - 5x + 6 = 0"  
• "Giải √(x+1) = 3"

📝 **Các dạng phương trình tôi có thể giải:**

🔸 **Bậc nhất:** ax + b = 0
🔸 **Bậc hai:** ax² + bx + c = 0
🔸 **Phương trình tích:** (x-a)(x-b) = 0
🔸 **Chứa căn:** √(ax+b) = c
🔸 **Chứa ẩn ở mẫu:** a/(x+b) = c
🔸 **Trị tuyệt đối:** |ax+b| = c

💡 **Mẹo:** Viết phương trình rõ ràng để tôi giải chính xác nhất!

Bạn có phương trình nào cần giải không? 🎯`;
    } else {
      aiResponse = `💭 **Tôi hiểu bạn đang hỏi về:** "${message}"

🎓 **MathAI Learning - Trợ lý toán học thông minh**

🔥 **Chủ đề HOT:**
• 📊 Phân số và thập phân
• 📐 Phương trình và bất phương trình  
• 🔺 Hình học và công thức diện tích
• 🔢 Căn bậc hai và lũy thừa
• 📈 Hàm số và đồ thị

💡 **Gợi ý câu hỏi:**
• "Giải thích định lý Pythagore"
• "Cách rút gọn phân số"
• "Tạo 5 câu trắc nghiệm về hình tròn" 
• "Giải phương trình x² - 4 = 0"
• "Công thức tính diện tích tam giác"

🎯 **Hoặc sử dụng Quiz Generator để tạo đề thi tự động!**

Hãy hỏi cụ thể hơn để tôi giúp bạn hiệu quả nhất! 😊✨`;
    }

    res.json({
      message: "AI response generated",
      response: aiResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// AI Exercise Generator endpoint
app.post("/api/ai/generate-exercises", authenticateToken, (req, res) => {
  try {
    const { topic, type, level, count } = req.body;

    const exercises = [];

    for (let i = 0; i < count; i++) {
      if (type === "multiple-choice") {
        exercises.push({
          id: i + 1,
          type: "multiple-choice",
          question: `Bài ${i + 1}: Câu hỏi trắc nghiệm về ${topic}`,
          content: `Trong ${topic} ở mức ${level}, biểu thức 2x + ${3 + i} = ${
            11 + i * 2
          } có nghiệm là:`,
          options: [
            `x = ${4 + i}`,
            `x = ${5 + i}`,
            `x = ${6 + i}`,
            `x = ${3 + i}`,
          ],
          answer: `x = ${4 + i}`,
          explanation: `Giải: 2x = ${11 + i * 2} - ${3 + i} = ${
            8 + i
          }, nên x = ${4 + i}`,
        });
      } else if (type === "fill-blank") {
        exercises.push({
          id: i + 1,
          type: "fill-blank",
          question: `Bài ${i + 1}: Điền vào chỗ trống`,
          content: `Trong ${topic}, công thức tính diện tích hình vuông cạnh a là: S = ____`,
          answer: "a²",
          explanation: "Diện tích hình vuông = cạnh × cạnh = a²",
        });
      } else if (type === "essay") {
        exercises.push({
          id: i + 1,
          type: "essay",
          question: `Bài ${i + 1}: Câu hỏi tự luận về ${topic}`,
          content: `Hãy giải thích ứng dụng của ${topic} trong đời sống hàng ngày và nêu ít nhất 3 ví dụ cụ thể.`,
          sampleAnswer: `1. Tính toán chi tiêu hàng ngày\n2. Đo lường và xây dựng\n3. Phân chia tài sản và thời gian\n\n${topic} giúp chúng ta giải quyết nhiều vấn đề thực tế...`,
        });
      }
    }

    res.json({
      message: "Exercises generated successfully",
      exercises: exercises,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/ai/generate-map", authenticateToken, (req, res) => {
  try {
    const { userId } = req.user;
    const userProgress = progress.filter((p) => p.userId === userId);

    // Generate learning map based on progress
    const learningMap = {
      nodes: topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        level: topic.level,
        category: topic.category,
        completed: userProgress.some(
          (p) => p.topicId === topic.id && p.completed
        ),
        locked: topic.prerequisites.some(
          (prereq) =>
            !userProgress.some((p) => p.topicId === prereq && p.completed)
        ),
        x: Math.random() * 800,
        y: Math.random() * 600,
        xp: topic.xp,
      })),
      connections: topics.flatMap((topic) =>
        topic.prerequisites.map((prereq) => ({
          from: prereq,
          to: topic.id,
        }))
      ),
    };

    res.json({
      message: "Learning map generated successfully",
      map: learningMap,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Class Routes (for teachers)
app.post("/api/classes", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create classes" });
    }

    const { name, description, grade } = req.body;
    const newClass = {
      id: uuidv4(),
      name,
      description,
      grade,
      teacherId: req.user.userId,
      students: [],
      createdAt: new Date(),
    };

    classes.push(newClass);
    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/classes", authenticateToken, (req, res) => {
  try {
    let userClasses;

    if (req.user.role === "teacher") {
      userClasses = classes.filter((c) => c.teacherId === req.user.userId);
    } else {
      userClasses = classes.filter((c) => c.students.includes(req.user.userId));
    }

    res.json(userClasses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User Routes
app.get("/api/users/profile", authenticateToken, (req, res) => {
  try {
    const user = users.find((u) => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProgress = progress.filter((p) => p.userId === req.user.userId);
    const completedTopics = userProgress.filter((p) => p.completed).length;

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level,
      xp: user.xp,
      completedTopics,
      totalTopics: topics.length,
      achievements: user.achievements || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Leaderboard Route
app.get("/api/leaderboard", (req, res) => {
  try {
    const leaderboard = users
      .filter((u) => u.role === "student")
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        level: user.level,
        xp: user.xp,
        completedTopics: progress.filter(
          (p) => p.userId === user.id && p.completed
        ).length,
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Teacher-specific Routes
app.get("/api/teacher/stats", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Teacher role required." });
    }

    // Calculate teacher statistics
    const teacherClasses = classes.filter(
      (c) => c.teacherId === req.user.userId
    );
    const teacherStudents = users.filter(
      (u) =>
        u.role === "student" &&
        teacherClasses.some((c) => c.students && c.students.includes(u.id))
    );

    const activeAssignments = assignments
      ? assignments.filter(
          (a) =>
            teacherClasses.some((c) => c.id === a.classId) &&
            a.status === "active"
        ).length
      : 0;

    const totalProgress = progress.filter((p) =>
      teacherStudents.some((s) => s.id === p.userId)
    );
    const averageProgress =
      totalProgress.length > 0
        ? Math.round(
            totalProgress.reduce(
              (sum, p) => sum + (p.completed ? 100 : p.progress || 0),
              0
            ) / totalProgress.length
          )
        : 0;

    res.json({
      totalStudents: teacherStudents.length,
      totalClasses: teacherClasses.length,
      activeAssignments: activeAssignments,
      averageProgress: averageProgress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/teacher/students", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Teacher role required." });
    }

    // Get students from teacher's classes
    const teacherClasses = classes.filter(
      (c) => c.teacherId === req.user.userId
    );
    const teacherStudents = users
      .filter((u) => u.role === "student")
      .map((student) => {
        const studentProgress = progress.filter((p) => p.userId === student.id);
        const totalTopics = topics.length;
        const completedTopics = studentProgress.filter(
          (p) => p.completed
        ).length;
        const progressPercentage =
          totalTopics > 0
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0;

        // Find student's class
        const studentClass = teacherClasses.find(
          (c) => c.students && c.students.includes(student.id)
        ) || { name: "Chưa phân lớp" };

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          class: studentClass.name,
          progress: progressPercentage,
          lastActive: student.lastLogin || new Date().toISOString(),
          xp: student.xp || Math.floor(Math.random() * 2000) + 500,
        };
      });

    res.json({ students: teacherStudents });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/teacher/assignments", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Teacher role required." });
    }

    // Mock assignments data for demo
    const teacherAssignments = [
      {
        id: 1,
        title: "Bài tập Phân số",
        description: "Luyện tập các phép tính với phân số",
        classId: 1,
        className: "Lớp 6A",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        submitted: 25,
        total: 32,
        status: "active",
      },
      {
        id: 2,
        title: "Quiz Hình học",
        description: "Kiểm tra kiến thức về tam giác",
        classId: 2,
        className: "Lớp 7B",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        submitted: 28,
        total: 28,
        status: "completed",
      },
      {
        id: 3,
        title: "Bài tập Đại số",
        description: "Giải phương trình bậc nhất",
        classId: 1,
        className: "Lớp 6A",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        submitted: 15,
        total: 32,
        status: "active",
      },
    ];

    res.json({ assignments: teacherAssignments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/assignments", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. Teacher role required." });
    }

    const { title, description, classId, dueDate, difficulty } = req.body;

    // Find the class
    const targetClass = classes.find((c) => c.id == classId);
    if (!targetClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newAssignment = {
      id: Date.now(),
      title,
      description,
      classId: parseInt(classId),
      className: targetClass.name,
      dueDate,
      difficulty,
      submitted: 0,
      total: targetClass.studentCount || 30,
      status: "active",
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
    };

    // In a real app, save to database
    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Gemini AI Chat endpoint
app.post("/api/ai/gemini-chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // For now, return a mock response since we need to install Gemini package
    // TODO: Replace with actual Gemini AI integration
    const mockResponses = [
      "Đây là một câu hỏi toán học thú vị! Hãy để tôi giải thích cho bạn...",
      "Tôi hiểu bạn đang tìm hiểu về chủ đề này. Đây là cách tiếp cận tốt nhất...",
      "Để giải quyết bài toán này, chúng ta cần áp dụng các nguyên lý cơ bản...",
      "Tuyệt vời! Đây là một khái niệm quan trọng trong toán học. Hãy cùng khám phá...",
      "Tôi sẽ hướng dẫn bạn từng bước để hiểu rõ vấn đề này...",
    ];

    // Simulate AI processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const detailedResponse = `${randomResponse}\n\nCâu hỏi của bạn: "${message}"\n\nĐây là câu trả lời chi tiết mà tôi có thể cung cấp. Trong thực tế, đây sẽ là phản hồi từ Gemini AI với nội dung phong phú và chính xác hơn.`;

    res.json({
      response: detailedResponse,
      status: "success",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gemini chat error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to process AI request",
    });
  }
});

// Topics Management Routes
app.get("/api/topics", (req, res) => {
  try {
    // Return topics with teacher customizations
    const enhancedTopics = topics.map((topic) => ({
      ...topic,
      customVideos: topic.customVideos || [],
      classAssignments: topic.classAssignments || [],
    }));
    res.json(enhancedTopics);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/topics/:topicId/upload-video", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can upload videos" });
    }

    const { topicId } = req.params;
    const { videoUrl, title, description, classId } = req.body;

    const topic = topics.find((t) => t.id == topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Initialize customVideos array if it doesn't exist
    if (!topic.customVideos) {
      topic.customVideos = [];
    }

    const newVideo = {
      id: `video-${Date.now()}`,
      title,
      description,
      videoUrl,
      classId,
      teacherId: req.user.userId,
      uploadedAt: new Date().toISOString(),
    };

    topic.customVideos.push(newVideo);

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post(
  "/api/topics/:topicId/create-assignment",
  authenticateToken,
  (req, res) => {
    try {
      if (req.user.role !== "teacher") {
        return res
          .status(403)
          .json({ message: "Only teachers can create assignments" });
      }

      const { topicId } = req.params;
      const { title, description, classId, dueDate, questions } = req.body;

      const topic = topics.find((t) => t.id == topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Verify teacher owns the class
      const classExists = classes.find(
        (c) => c.id === classId && c.teacherId === req.user.userId
      );
      if (!classExists) {
        return res.status(403).json({
          message: "You can only create assignments for your own classes",
        });
      }

      const newAssignment = {
        id: `topic-assign-${Date.now()}`,
        title,
        description,
        topicId: parseInt(topicId),
        classId,
        teacherId: req.user.userId,
        dueDate,
        status: "active",
        questions,
        submissions: [],
        createdAt: new Date().toISOString(),
      };

      // Add to global assignments array
      assignments.push(newAssignment);

      // Also add to topic's classAssignments for easy access
      if (!topic.classAssignments) {
        topic.classAssignments = [];
      }
      topic.classAssignments.push(newAssignment);

      res.status(201).json({
        message: "Assignment created successfully",
        assignment: newAssignment,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

app.get(
  "/api/topics/:topicId/assignments/:classId",
  authenticateToken,
  (req, res) => {
    try {
      const { topicId, classId } = req.params;

      // Find assignments for this specific topic and class
      const topicAssignments = assignments.filter(
        (a) => a.topicId == topicId && a.classId === classId
      );

      // If user is student, check if they're in the class
      if (req.user.role === "student") {
        const userClass = classes.find((c) => c.id === classId);
        if (!userClass || !userClass.studentIds.includes(req.user.userId)) {
          return res.status(403).json({
            message: "You can only access assignments from your own classes",
          });
        }
      }

      res.json(topicAssignments);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

app.get(
  "/api/topics/:topicId/videos/:classId",
  authenticateToken,
  (req, res) => {
    try {
      const { topicId, classId } = req.params;

      const topic = topics.find((t) => t.id == topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      // Get videos for this specific class
      const classVideos = (topic.customVideos || []).filter(
        (v) => v.classId === classId
      );

      res.json({
        defaultVideo: topic.videoUrl,
        customVideos: classVideos,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Math Learning Platform API is running" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Initialize demo accounts
  await initializeDemoAccounts();

  // Initialize demo data
  await initializeDemoData();
});

module.exports = app;
