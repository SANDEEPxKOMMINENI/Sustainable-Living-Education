import api from './index';
import type { User, Exam } from '../types/auth';

export const adminApi = {
  // Student Management
  getStudents: () => api.get('/admin/students'),
  updateStudent: (id: string, data: Partial<User>) => 
    api.put(`/admin/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/admin/students/${id}`),
  
  // Exam Management
  getExams: () => api.get('/admin/exams'),
  createExam: (data: Omit<Exam, 'id'>) => api.post('/admin/exams', data),
  updateExam: (id: string, data: Partial<Exam>) => 
    api.put(`/admin/exams/${id}`, data),
  deleteExam: (id: string) => api.delete(`/admin/exams/${id}`),
  
  // Question Management
  addQuestion: (examId: string, data: any) => 
    api.post(`/admin/exams/${examId}/questions`, data),
  updateQuestion: (examId: string, questionId: string, data: any) => 
    api.put(`/admin/exams/${examId}/questions/${questionId}`, data),
  deleteQuestion: (examId: string, questionId: string) => 
    api.delete(`/admin/exams/${examId}/questions/${questionId}`)
};