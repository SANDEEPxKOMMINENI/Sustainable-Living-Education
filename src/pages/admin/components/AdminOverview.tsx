import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, GraduationCap, Award } from 'lucide-react';

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const statCards = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      change: '+12%',
      trend: 'up',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Active Courses',
      value: stats?.activeCourses || 0,
      change: '+5',
      trend: 'up',
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'Course Completions',
      value: stats?.courseCompletions || 0,
      change: '+18%',
      trend: 'up',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      change: '+2.5%',
      trend: 'up',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="text-emerald-600">{card.icon}</div>
              <span
                className={`text-sm font-medium ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {card.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mt-4">
              {card.title}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Enrollments
          </h2>
          {/* Add enrollment list component here */}
        </div>

        {/* Recent Course Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Course Activity
          </h2>
          {/* Add course activity component here */}
        </div>
      </div>
    </div>
  );
}