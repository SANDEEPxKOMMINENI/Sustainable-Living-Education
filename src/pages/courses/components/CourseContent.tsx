import React from 'react';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  duration: number;
  completed?: boolean;
}

interface CourseContentProps {
  lessons: Lesson[];
  isEnrolled: boolean;
  onLessonClick: (lessonId: number) => void;
  completedLessons: number[];
}

export default function CourseContent({
  lessons,
  isEnrolled,
  onLessonClick,
  completedLessons,
}: CourseContentProps) {
  const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0);
  const progress = lessons.length > 0
    ? (completedLessons.length / lessons.length) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{lessons.length}</span> lessons
          ({Math.round(totalDuration / 60)} hours total)
        </div>
      </div>

      {isEnrolled && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Your progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            onClick={() => isEnrolled && onLessonClick(lesson.id)}
            className={`flex items-center justify-between p-4 rounded-lg ${
              isEnrolled
                ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-medium">
                {completedLessons.includes(lesson.id) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </span>
              <div>
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lesson.duration} minutes</span>
                </div>
              </div>
            </div>
            {!isEnrolled && (
              <div className="text-gray-400">
                <BookOpen className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {!isEnrolled && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-center">
            Enroll in this course to access all lessons and materials
          </p>
        </div>
      )}
    </div>
  );
}