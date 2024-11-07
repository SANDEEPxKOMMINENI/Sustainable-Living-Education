import React from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';
import type { Course } from '../../types';
import { useCourses } from '../../hooks/useCourses';

interface CourseDetailProps {
  course: Course;
}

export default function CourseDetail({ course }: CourseDetailProps) {
  const { enrollInCourse } = useCourses();
  const [enrolling, setEnrolling] = React.useState(false);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollInCourse(course.id);
      // Handle successful enrollment
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="relative h-96 mb-8">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-xl" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          {course.curriculum && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Course Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{module.title}</h3>
                    <ul className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex items-center justify-between text-gray-600">
                          <span>{lesson.title}</span>
                          <span className="text-sm">{lesson.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Clock size={20} className="text-gray-500 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <Users size={20} className="text-gray-500 mr-2" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={20} className="text-gray-500 mr-2" />
                <span>{course.lessons} lessons</span>
              </div>
            </div>
            
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}