import { ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  students: number;
  lessons: number;
  curriculum?: LessonModule[];
  instructor?: Instructor;
  progress?: number;
}

export interface LessonModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
}

export interface Progress {
  courseId: string;
  completedLessons: string[];
  lastAccessed: string;
  quizScores: Record<string, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  enrolledCourses: Progress[];
  completedCourses: string[];
  certificates: Certificate[];
}

export interface Certificate {
  courseId: string;
  issueDate: string;
  certificateUrl: string;
}

// ... rest of the existing types remain the same