import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  GraduationCap,
  AlertCircle,
  BookOpenCheck,
  History,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardData {
  activeCourses: number;
  completedCourses: number;
  hoursSpent: number;
  recentActivity: {
    id: number;
    type: string;
    description: string;
    datetime: string;
    time: string;
    course: string;
  }[];
}

interface EnrolledCourse {
  id: number;
  title: string;
  image_url: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function StudentDashboard() {
  const { user } = useAuth();

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useQuery<DashboardData>({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/api/student/dashboard',
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch dashboard data');
      }
      return response.json();
    },
  });

  const {
    data: enrolledCourses,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery<EnrolledCourse[]>({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/api/student/courses',
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch enrolled courses');
      }
      return response.json();
    },
  });

  const isLoading = isDashboardLoading || isCoursesLoading;
  const error = dashboardError || coursesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : 'Failed to load dashboard'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return BookOpen;
      case 'completion':
        return BookOpenCheck;
      default:
        return History;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-emerald-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-emerald-100">
          Continue your journey towards sustainable living.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-emerald-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {dashboard?.activeCourses || 0}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Active Courses</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-emerald-600">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {dashboard?.hoursSpent || 0}h
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Hours Spent Learning</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-emerald-600">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {dashboard?.completedCourses || 0}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Completed Courses</p>
        </div>
      </div>

      {/* Current Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Current Courses
          </h2>
          <Link
            to="/courses"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Browse More Courses
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {enrolledCourses?.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="p-6 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {course.title}
                  </h3>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {course.progress || 0}% complete
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
          {(!enrolledCourses || enrolledCourses.length === 0) && (
            <div className="p-6 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by enrolling in your first course
              </p>
              <div className="mt-6">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <div className="mt-6 flow-root">
            <ul className="-mb-8">
              {dashboard?.recentActivity?.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== dashboard.recentActivity.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center ring-8 ring-white">
                            <ActivityIcon className="h-4 w-4 text-emerald-600" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                              {activity.course && (
                                <span className="font-medium text-gray-900">
                                  {' '}
                                  {activity.course}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={activity.datetime}>
                              {activity.time}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              {(!dashboard?.recentActivity ||
                dashboard.recentActivity.length === 0) && (
                <li className="text-center py-4 text-gray-500">
                  No recent activity
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}