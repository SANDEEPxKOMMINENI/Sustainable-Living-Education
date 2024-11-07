import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseList from './components/course/CourseList';
import Features from './components/Features';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { Toaster } from './components/ui/Toaster';
import AdminDashboard from './components/admin/AdminDashboard';
import ExamPortal from './components/exam/ExamPortal';
import UserProfile from './components/profile/UserProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuthStore from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
        <Toaster />
        <Navbar />
        
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <div className="relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative">
                  <CourseList />
                </div>
              </div>
              <CTASection />
            </>
          } />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/exam/:examId" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamPortal />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;