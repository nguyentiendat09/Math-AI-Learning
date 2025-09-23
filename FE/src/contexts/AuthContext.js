import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 AuthContext: Checking stored token:", token);

    // Restore joined classrooms from localStorage
    const savedClassrooms = localStorage.getItem("joinedClassrooms");
    if (savedClassrooms) {
      try {
        setJoinedClassrooms(JSON.parse(savedClassrooms));
      } catch (error) {
        console.error("❌ Failed to parse joined classrooms:", error);
      }
    }

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Check if it's a demo token
      if (token === "demo-token") {
        console.log("🎭 Demo token detected, restoring demo user...");
        // For demo accounts, restore user data from localStorage
        const demoUserData = localStorage.getItem("demoUser");
        if (demoUserData) {
          try {
            const userData = JSON.parse(demoUserData);
            setUser(userData);
            console.log("✅ Demo user restored from localStorage:", userData);
          } catch (error) {
            console.error("❌ Failed to parse demo user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("demoUser");
          }
        } else {
          console.log("❌ No demo user data found, clearing token");
          // No demo user data found, clear token
          localStorage.removeItem("token");
        }
        setLoading(false);
      } else {
        console.log("🌐 Regular token detected, fetching from API...");
        // Regular API token, fetch from server
        fetchUserProfile();
      }
    } else {
      console.log("❌ No token found");
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/users/profile");
      setUser(response.data);
    } catch (error) {
      // Clear authentication data if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("demoUser");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Demo accounts for testing grade restrictions
      const demoAccounts = {
        "student6@demo.com": {
          grade: 6,
          role: "student",
          name: "Học sinh lớp 6",
          email: "student6@demo.com",
          level: 3,
          xp: 1200,
        },
        "student7@demo.com": {
          grade: 7,
          role: "student",
          name: "Học sinh lớp 7",
          email: "student7@demo.com",
          level: 4,
          xp: 1850,
        },
        "student8@demo.com": {
          grade: 8,
          role: "student",
          name: "Học sinh lớp 8",
          email: "student8@demo.com",
          level: 5,
          xp: 2300,
        },
        "student9@demo.com": {
          grade: 9,
          role: "student",
          name: "Học sinh lớp 9",
          email: "student9@demo.com",
          level: 6,
          xp: 2800,
        },
        "teacher@demo.com": {
          role: "teacher",
          name: "Giáo viên Demo",
          email: "teacher@demo.com",
        },
        // Legacy demo account for backward compatibility
        "student@demo.com": {
          grade: 7,
          role: "student",
          name: "Học sinh Demo",
          email: "student@demo.com",
          level: 4,
          xp: 1600,
        },
      };

      // Check if it's a demo account first
      if (
        (demoAccounts[email] && password === "demo123") ||
        (email === "teacher@demo.com" && password === "teacher123")
      ) {
        const userData = demoAccounts[email];
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("demoUser", JSON.stringify(userData)); // Save demo user data
        setUser(userData);
        console.log("✅ Demo login successful:", userData);
        return { success: true };
      }

      // Try API login for real accounts
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Sai email hoặc mật khẩu",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("demoUser"); // Remove demo user data
    localStorage.removeItem("joinedClassrooms"); // Remove joined classrooms
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setJoinedClassrooms([]);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  // Function to join a classroom and save to session
  const joinClassroom = (classroom) => {
    const newJoinedClassrooms = [...joinedClassrooms, classroom];
    setJoinedClassrooms(newJoinedClassrooms);
    localStorage.setItem(
      "joinedClassrooms",
      JSON.stringify(newJoinedClassrooms)
    );
  };

  // Function to check if user has joined a classroom
  const hasJoinedClassroom = (classroomId) => {
    return joinedClassrooms.some((classroom) => classroom.id === classroomId);
  };

  // Function to get joined classroom by ID
  const getJoinedClassroom = (classroomId) => {
    return joinedClassrooms.find(
      (classroom) => classroom.id === parseInt(classroomId)
    );
  };

  // Helper function to check if user can access a topic level
  const canAccessLevel = (topicLevel) => {
    if (!user || user.role !== "student") {
      return true; // Teachers and non-students can access all levels
    }

    if (!user.grade || !topicLevel) {
      return true; // Allow access if grade or level is not set
    }

    // Extract grade numbers from user grade and topic level
    const userGrade = parseInt(user.grade);
    const topicGrade = parseInt(topicLevel.replace(/[^\d]/g, ""));

    // Students can ONLY access topics of their exact grade level
    return topicGrade === userGrade;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    canAccessLevel,
    joinedClassrooms,
    joinClassroom,
    hasJoinedClassroom,
    getJoinedClassroom,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
