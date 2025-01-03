import React from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';

interface EnrollmentCardProps {
  course: {
    duration: number;
    lessons: any[];
    video_url?: string;
  };
  enrollment: any;
  isEnrolling: boolean;
  onEnroll: () => void;
  progress?: number;
}

export default function EnrollmentCard({
  course,
  enrollment,
  isEnrolling,
  onEnroll,
  progress = 0,
}: EnrollmentCardProps) {
  const getYouTubeEmbedUrl = (url: string) => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
      {enrollment ? (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Course Progress
          </h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Overall progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => window.location.href = '#current-lesson'}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      ) : (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Start Learning Today
          </h3>
          <p className="text-gray-600">
            Join our community of learners and make a difference
          </p>
          <button
            onClick={onEnroll}
            disabled={isEnrolling}
            className="w-full mt-4 bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
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
          <h4 className="font-medium text-gray-900 mb-2">Preview Video</h4>
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
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                <span>Video unavailable</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}