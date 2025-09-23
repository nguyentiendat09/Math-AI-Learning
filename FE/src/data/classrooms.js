// Shared classroom data for consistency across the app
export const SHARED_CLASSROOMS = {
  MATH7A: {
    id: 1,
    name: "Toán học lớp 7A",
    description: "Lớp học toán cho học sinh lớp 7",
    subject: "Toán học",
    grade: 7,
    code: "MATH7A",
    teacher: "Cô Nguyễn Thị Hoa",
    studentCount: 25,
    quizCount: 5,
    createdAt: "2024-09-01",
    isActive: true,
  },
  MATH8B: {
    id: 2,
    name: "Toán học lớp 8B",
    description: "Lớp học toán nâng cao",
    subject: "Toán học",
    grade: 8,
    code: "MATH8B",
    teacher: "Thầy Trần Văn Nam",
    studentCount: 22,
    quizCount: 3,
    createdAt: "2024-09-05",
    isActive: true,
  },
};

// Function to get all classrooms (shared + custom)
export const getAllClassrooms = () => {
  const sharedClassrooms = Object.values(SHARED_CLASSROOMS);
  const customClassrooms = getCustomClassrooms();
  return [...sharedClassrooms, ...customClassrooms];
};

// Function to get custom classrooms from localStorage
export const getCustomClassrooms = () => {
  try {
    const stored = localStorage.getItem("customClassrooms");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading custom classrooms:", error);
    return [];
  }
};

// Function to save custom classroom to localStorage
export const saveCustomClassroom = (classroom) => {
  try {
    const customClassrooms = getCustomClassrooms();
    const updatedClassrooms = [...customClassrooms, classroom];
    localStorage.setItem("customClassrooms", JSON.stringify(updatedClassrooms));
    console.log("✅ Saved classroom to localStorage:", classroom);
    return true;
  } catch (error) {
    console.error("❌ Error saving classroom:", error);
    return false;
  }
};

// Convert to array for components that need array format
export const SHARED_CLASSROOMS_ARRAY = Object.values(SHARED_CLASSROOMS);

// Get classrooms by grade
export const getClassroomsByGrade = (grade) => {
  return getAllClassrooms().filter((classroom) => classroom.grade === grade);
};

// Get classroom by code (both shared and custom)
export const getClassroomByCode = (code) => {
  const allClassrooms = getAllClassrooms();
  return allClassrooms.find((classroom) => classroom.code === code) || null;
};

// Get classroom by id (both shared and custom)
export const getClassroomById = (id) => {
  const allClassrooms = getAllClassrooms();
  const result = allClassrooms.find(
    (classroom) => classroom.id === parseInt(id)
  );
  return result;
};
