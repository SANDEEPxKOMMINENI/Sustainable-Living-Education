export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  enrolledStudents: string[];
  examEnabled: boolean;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  duration: number; // in minutes
  passingPercentage: number;
  questions: Question[];
  availableToStudents: string[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}

export interface ExamSubmission {
  examId: string;
  studentId: string;
  answers: { [questionId: string]: number };
  score: number;
  passed: boolean;
  submittedAt: string;
}