import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart,
  UserCog,
  GraduationCap,
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { icon: <LayoutDashboard />, text: 'Overview', path: '/admin' },
    { icon: <BookOpen />, text: 'Courses', path: '/admin/courses' },
    { icon: <GraduationCap />, text: 'Exams', path: '/admin/exams' },
    { icon: <Users />, text: 'Enrollments', path: '/admin/enrollments' },
    { icon: <UserCog />, text: 'Users', path: '/admin/users' },
    { icon: <BarChart />, text: 'Analytics', path: '/admin/analytics' },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-sm">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {item.icon}
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}