import type { Course, UserProfile, Progress } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Sustainable Living',
    description: 'Learn the fundamentals of sustainable living and how to reduce your environmental impact.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000',
    duration: '6 weeks',
    students: 1234,
    lessons: 12,
    progress: 0,
    instructor: {
      id: '1',
      name: 'Dr. Emma Green',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
      bio: 'Environmental Science Professor with 10+ years experience'
    }
  },
  {
    id: '2',
    title: 'Zero Waste Living',
    description: 'Master practical techniques for reducing waste and living a more sustainable lifestyle.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000',
    duration: '4 weeks',
    students: 856,
    lessons: 8,
    progress: 0,
    instructor: {
      id: '2',
      name: 'Mark Rivers',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      bio: 'Zero Waste Advocate and Environmental Consultant'
    }
  }
];

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  bio: 'Passionate about sustainable living and environmental conservation',
  interests: ['Sustainability', 'Zero Waste', 'Renewable Energy'],
  enrolledCourses: [
    {
      courseId: '1',
      completedLessons: ['1', '2'],
      lastAccessed: '2024-03-10T10:00:00Z',
      quizScores: { 'quiz1': 85 }
    }
  ],
  completedCourses: [],
  certificates: []
};