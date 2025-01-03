import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Users, Award, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToaster } from '../../components/ui/Toaster';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToaster();
  const queryClient = useQueryClient();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/courses/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch course');
      }
      return response.json();
    },
    retry: 2,
  });

  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      if (!user) return null;
      const response = await fetch(
        `http://localhost:3000/api/courses/${id}/enrollment`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/courses/${id}/enroll`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        // Handle authentication requirement
        if (response.status === 401 && data.requiresAuth) {
          navigate('/login');
          throw new Error('Please log in to enroll in this course');
        }
        throw new Error(data.message || 'Failed to enroll in course');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', id] });
      showToast(data.message || 'Enrollment request submitted successfully', 'success');
      setIsEnrolling(false);
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : 'Failed to enroll',
        'error'
      );
      setIsEnrolling(false);
    },
  });

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsEnrolling(true);
    enrollMutation.mutate();
  };

  const getEnrollmentStatus = () => {
    if (!enrollment) return null;
    switch (enrollment.status) {
      case 'pending':
        return (
          <div className="flex items-center text-yellow-600">
            <Clock className="h-5 w-5 mr-2" />
            Enrollment Pending
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center text-green-600">
            <Award className="h-5 w-5 mr-2" />
            Enrolled
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Enrollment Denied
          </div>
        );
      default:
        return null;
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
      )?.[1];
      return videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to load course
        </h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ['course', id] })
          }
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Course Header */}
      <div className="relative h-96 rounded-xl overflow-hidden">
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">
              {course.title}
            </h1>
            <div className="flex items-center space-x-6 text-white mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{course.enrollment_count || 0} students</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
            </div>
            {getEnrollmentStatus()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Course
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Curriculum
            </h2>
            <div className="space-y-4">
              {course.lessons?.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {lesson.duration} minutes
                      </p>
                    </div>
                  </div>
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Start Learning Today
              </h3>
              <p className="text-gray-600">
                Join our community of learners and make a difference
              </p>
            </div>

            {!enrollment && (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 text-emerald-600 mr-3" />
                <span>{course.duration} hours of content</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-5 w-5 text-emerald-600 mr-3" />
                <span>{course.lessons?.length || 0} comprehensive lessons</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="h-5 w-5 text-emerald-600 mr-3" />
                <span>Certificate of completion</span>
              </div>
            </div>

            {course.video_url && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Preview Video
                </h4>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  {getYouTubeEmbedUrl(course.video_url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(course.video_url)}
                      title="Course Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="strict-origin"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                      <AlertCircle className="h-8 w-8 mr-2" />
                      <span>Video unavailable</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}