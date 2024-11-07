import React from 'react';
import { CheckCircle, PlayCircle, FileText } from 'lucide-react';
import type { Lesson } from '../../types';
import { useProgress } from '../../hooks/useProgress';

interface LessonViewProps {
  lesson: Lesson;
  courseId: string;
}

export default function LessonView({ lesson, courseId }: LessonViewProps) {
  const { markLessonComplete } = useProgress(courseId);
  
  const handleComplete = async () => {
    try {
      await markLessonComplete(lesson.id);
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>
        
        {lesson.videoUrl && (
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <div className="space-y-2">
              {lesson.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                >
                  {resource.type === 'pdf' ? (
                    <FileText size={20} />
                  ) : resource.type === 'video' ? (
                    <PlayCircle size={20} />
                  ) : (
                    <FileText size={20} />
                  )}
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={lesson.completed}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
            lesson.completed
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <CheckCircle size={20} />
          <span>{lesson.completed ? 'Completed' : 'Mark as Complete'}</span>
        </button>
      </div>
    </div>
  );
}