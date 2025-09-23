import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoAccounts from "./pages/DemoAccounts";
import Dashboard from "./pages/Dashboard";
import TopicDetail from "./pages/TopicDetail";
import TopicEdit from "./pages/TopicEdit";
import TopicCreate from "./pages/TopicCreate";
import LearningMap from "./pages/LearningMap";
import AIGenerator from "./pages/AIGenerator";
import TeacherDashboard from "./pages/TeacherDashboard";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import ClassroomManagement from "./pages/ClassroomManagement";
import ClassroomDetail from "./pages/ClassroomDetail";
import JoinClassroom from "./pages/JoinClassroom";
import StudentClassroomView from "./pages/StudentClassroomView";
import QuizCreate from "./pages/QuizCreate";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Protected Route component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/demo"
          element={user ? <Navigate to="/dashboard" /> : <DemoAccounts />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "teacher" ? <TeacherDashboard /> : <Dashboard />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/topic/:id"
          element={
            <ProtectedRoute>
              <TopicDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topic/:id/edit"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TopicEdit />
            </ProtectedRoute>
          }
        />

        {/* NEW ROUTE: Create New Topic */}
        <Route
          path="/topic/create"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TopicCreate />
            </ProtectedRoute>
          }
        />

        {/* OLD ROUTES - DEPRECATED */}
        <Route
          path="/topic-edit/new"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TopicCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topic-edit/:id"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TopicEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning-map"
          element={
            <ProtectedRoute>
              <LearningMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-generator"
          element={
            <ProtectedRoute>
              <AIGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Classroom Management Routes */}
        <Route
          path="/classroom-management"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <ClassroomManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classroom/:id"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <ClassroomDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/join-classroom"
          element={
            <ProtectedRoute roles={["student"]}>
              <JoinClassroom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-classroom/:id"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentClassroomView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classroom/:classroomId/quiz/create"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <QuizCreate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
