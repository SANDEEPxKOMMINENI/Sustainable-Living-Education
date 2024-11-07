import api from './index';
import type { Course } from '../types';

export const courses = {
  getAll: () => 
    api.get('/courses'),
  
  getById: (id: string) => 
    api.get(`/courses/${id}`),
  
  enroll: (courseId: string) => 
    api.post(`/courses/${courseId}/enroll`),
  
  getProgress: (courseId: string) => 
    api.get(`/courses/${courseId}/progress`),
  
  getLessons: (courseId: string) => 
    api.get(`/courses/${courseId}/lessons`),
  
  markLessonComplete: (courseId: string, lessonId: string) => 
    api.post(`/courses/${courseId}/lessons/${lessonId}/complete`)
};