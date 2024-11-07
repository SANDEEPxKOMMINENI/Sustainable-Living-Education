import React, { useState } from 'react';
import { Users, BookOpen, FileText } from 'lucide-react';
import CourseManagement from './CourseManagement';
import StudentList from './StudentList';
import ExamManagement from './ExamManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'exams', label: 'Exams', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage courses, students, and exams</p>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="mr-2" size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === 'courses' && <CourseManagement />}
          {activeTab === 'students' && <StudentList />}
          {activeTab === 'exams' && <ExamManagement />}
        </div>
      </div>
    </div>
  );
}