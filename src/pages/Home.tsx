import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BookOpen, Award, Users } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Sustainable Living',
      description: 'Learn practical ways to reduce your environmental impact and live sustainably.',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Expert-Led Courses',
      description: 'Access high-quality courses created by sustainability experts and practitioners.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with course completion certificates.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Learning',
      description: 'Join a community of like-minded individuals committed to sustainable living.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-emerald-600 text-white py-20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Learn to Live Sustainably
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform to learn practical skills for sustainable living and make a positive impact on the environment.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/courses"
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              to="/register"
              className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose EcoLearn?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-emerald-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 rounded-3xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already making a difference through sustainable living education.
          </p>
          <Link
            to="/register"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}