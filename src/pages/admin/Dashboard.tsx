import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminOverview from './components/AdminOverview';
import CourseManagement from './components/CourseManagement';
import EnrollmentManagement from './components/EnrollmentManagement';
import UserManagement from './components/UserManagement';
import Analytics from './components/Analytics';
import ExamManagement from './components/ExamManagement';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/courses/*" element={<CourseManagement />} />
          <Route path="/exams/*" element={<ExamManagement />} />
          <Route path="/enrollments" element={<EnrollmentManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
}