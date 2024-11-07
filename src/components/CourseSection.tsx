import React from 'react';
import CourseCard from './CourseCard';
import type { Course } from '../types';

export default function CourseSection() {
  const courses: Course[] = [
    {
      id: '1',
      title: "Sustainable Home Living",
      description: "Learn practical ways to reduce your home's environmental impact",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      duration: "6 weeks",
      students: 1234,
      lessons: 24
    },
    {
      id: '2',
      title: "Zero Waste Lifestyle",
      description: "Master the art of living without producing waste",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
      duration: "4 weeks",
      students: 856,
      lessons: 18
    },
    {
      id: '3',
      title: "Renewable Energy Basics",
      description: "Understanding clean energy solutions for a sustainable future",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
      duration: "8 weeks",
      students: 2156,
      lessons: 32
    }
  ];

  return (
    <section id="courses" className="py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Courses</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}