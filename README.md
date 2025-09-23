# MathAI Learning Platform

Một nền tảng học toán trực tuyến với tích hợp AI, được xây dựng bằng React và Node.js.

## 🌟 Tính năng chính

### 🎓 Dành cho Học sinh

- **Dashboard cá nhân**: Theo dõi tiến độ học tập và thành tích
- **Bản đồ học tập tương tác**: Khám phá các chủ đề toán học theo lộ trình
- **AI Generator**: Tạo quiz, bài tập và trò chuyện với AI
- **Video bài giảng**: Học qua video chất lượng cao
- **Hệ thống điểm XP**: Gamification để tăng động lực học tập
- **Bảng xếp hạng**: Cạnh tranh tích cực với bạn bè
- **Hồ sơ cá nhân**: Quản lý thông tin và theo dõi thành tích

### 👨‍🏫 Dành cho Giáo viên

- **Teacher Dashboard**: Quản lý tổng quan lớp học
- **Quản lý học sinh**: Theo dõi tiến độ từng học sinh
- **Tạo bài tập**: Giao bài tập cho lớp với các mức độ khác nhau
- **Phân tích dữ liệu**: Thống kê hiệu suất học tập
- **Quản lý lớp học**: Tạo và quản lý nhiều lớp học

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 18.2.0** - Framework chính
- **React Router 6.8.1** - Điều hướng
- **Axios 1.3.4** - HTTP client
- **Lucide React 0.263.1** - Icons
- **Recharts 2.6.2** - Biểu đồ và thống kê
- **Framer Motion 10.12.4** - Animations

### Backend

- **Node.js** với **Express.js 4.18.2**
- **JWT (jsonwebtoken 9.0.2)** - Xác thực
- **bcryptjs 2.4.3** - Mã hóa mật khẩu
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **UUID 9.0.0** - Tạo ID duy nhất

## 📁 Cấu trúc dự án

```
MathAI/
├── BE/                          # Backend
│   ├── server.js               # Server chính
│   ├── package.json           # Dependencies backend
│   └── node_modules/          # Packages
│
└── FE/                          # Frontend
    ├── public/
    │   └── index.html          # HTML template
    ├── src/
    │   ├── App.js              # Component chính
    │   ├── index.js            # Entry point
    │   ├── index.css           # Global styles
    │   ├── components/
    │   │   └── Navbar.js       # Navigation bar
    │   ├── contexts/
    │   │   └── AuthContext.js  # Authentication context
    │   └── pages/
    │       ├── Home.js         # Trang chủ
    │       ├── Login.js        # Đăng nhập
    │       ├── Register.js     # Đăng ký
    │       ├── Dashboard.js    # Dashboard học sinh
    │       ├── TeacherDashboard.js # Dashboard giáo viên
    │       ├── TopicDetail.js  # Chi tiết chủ đề
    │       ├── LearningMap.js  # Bản đồ học tập
    │       ├── AIGenerator.js  # AI Generator
    │       ├── Profile.js      # Hồ sơ cá nhân
    │       └── Leaderboard.js  # Bảng xếp hạng
    ├── package.json           # Dependencies frontend
    └── node_modules/          # Packages
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js (version 14 trở lên)
- NPM hoặc Yarn

### 1. Clone project

```bash
git clone <repository-url>
cd MathAI
```

### 2. Cài đặt Backend

```bash
cd BE
npm install
```

### 3. Cài đặt Frontend

```bash
cd ../FE
npm install
```

### 4. Chạy ứng dụng

#### Chạy Backend (Terminal 1)

```bash
cd BE
npm start
# Server sẽ chạy tại http://localhost:5000
```

#### Chạy Frontend (Terminal 2)

```bash
cd FE
npm start
# App sẽ mở tại http://localhost:3000
```

## 📊 API Endpoints

### Authentication

- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập
- `GET /api/profile` - Lấy thông tin profile

### Topics & Progress

- `GET /api/topics` - Lấy danh sách chủ đề
- `GET /api/topics/:id` - Chi tiết chủ đề
- `POST /api/progress` - Cập nhật tiến độ
- `GET /api/progress/:userId` - Tiến độ của user

### AI Features

- `POST /api/ai/generate-quiz` - Tạo quiz với AI
- `POST /api/ai/chat` - Chat với AI
- `POST /api/ai/generate-exercises` - Tạo bài tập

### Teacher Features

- `GET /api/teacher/stats` - Thống kê giáo viên
- `GET /api/teacher/students` - Danh sách học sinh
- `GET /api/teacher/assignments` - Quản lý bài tập
- `POST /api/classes` - Tạo lớp học
- `POST /api/assignments` - Tạo bài tập

### Leaderboard

- `GET /api/leaderboard` - Bảng xếp hạng

## 🎨 Giao diện người dùng

### Trang chủ

- Hero section với CTA buttons
- Giới thiệu tính năng chính
- Testimonials từ học sinh và giáo viên

### Dashboard Học sinh

- Thống kê tiến độ học tập
- Chủ đề đang học và hoàn thành
- Biểu đồ XP và level
- Quick actions

### AI Generator

- **Quiz Generator**: Tạo quiz theo chủ đề và mức độ
- **AI Chat**: Trò chuyện và hỏi đáp với AI
- **Exercise Generator**: Tạo bài tập đa dạng

### Learning Map

- Bản đồ tương tác với các nodes chủ đề
- Hệ thống prerequisite và unlock
- Filter theo danh mục và trạng thái
- Search functionality

### Teacher Dashboard

- Tổng quan thống kê lớp học
- Quản lý học sinh và tiến độ
- Tạo và quản lý bài tập
- Analytics và reports

## 🔐 Bảo mật

- **JWT Authentication**: Xác thực và phân quyền
- **Password Hashing**: Mã hóa mật khẩu với bcrypt
- **Protected Routes**: Kiểm soát truy cập theo role
- **Input Validation**: Validate dữ liệu đầu vào

## 🎯 Gamification

- **XP System**: Điểm kinh nghiệm cho mọi hoạt động
- **Level System**: Thăng cấp dựa trên XP
- **Achievements**: Huy hiệu và thành tích
- **Leaderboard**: Bảng xếp hạng cạnh tranh
- **Progress Tracking**: Theo dõi tiến độ chi tiết

## 🤖 Tính năng AI

### Quiz Generator

- Tạo câu hỏi theo chủ đề
- Điều chỉnh độ khó và số lượng
- Đáp án và giải thích chi tiết

### AI Chat Assistant

- Hỏi đáp về toán học
- Giải thích khái niệm
- Hướng dẫn giải bài tập
- Gợi ý học tập

### Exercise Generator

- Tạo bài tập đa dạng
- Multiple choice, điền chỗ trống, tự luận
- Đáp án mẫu và hướng dẫn

## 📱 Responsive Design

- Tối ưu cho mọi thiết bị
- Mobile-first approach
- Responsive grid system
- Touch-friendly interface

## 🚀 Deployment

### Backend Deployment

```bash
# Build và deploy backend
cd BE
npm install --production
node server.js
```

### Frontend Deployment

```bash
# Build React app
cd FE
npm run build
# Deploy dist folder
```

## 🔄 Development Workflow

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### Testing

```bash
# Run frontend tests
cd FE
npm test

# Run backend tests (if available)
cd BE
npm test
```

## 📈 Performance

- **Code Splitting**: Lazy loading components
- **Caching**: API response caching
- **Optimization**: Image và asset optimization
- **Bundle Size**: Minimized production builds

## 🛟 Troubleshooting

### Common Issues

1. **Port Conflicts**

   ```bash
   # Change ports in package.json if needed
   PORT=3001 npm start
   ```

2. **Dependencies Issues**

   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS Issues**
   - Kiểm tra cấu hình CORS trong backend
   - Đảm bảo frontend gọi đúng backend URL

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Frontend Developer**: React.js, UI/UX
- **Backend Developer**: Node.js, API Design
- **AI Integration**: Machine Learning, NLP
- **DevOps**: Deployment, Infrastructure

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng:

- Tạo issue trên GitHub
- Liên hệ qua email
- Tham gia Discord community

---

**MathAI Learning Platform** - Revolutionizing Math Education with AI 🚀📚

