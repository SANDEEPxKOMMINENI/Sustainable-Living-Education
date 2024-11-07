import React from 'react';
import { Leaf, Globe, Wind, Award, Users, BookOpen } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Leaf,
      title: "Expert-Led Courses",
      description: "Learn from industry experts and experienced practitioners"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with like-minded individuals worldwide"
    },
    {
      icon: Wind,
      title: "Practical Learning",
      description: "Hands-on projects and real-world applications"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn recognized certificates upon completion"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Engage with peers in discussion forums"
    },
    {
      icon: BookOpen,
      title: "Flexible Learning",
      description: "Study at your own pace, anywhere, anytime"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="max-w-screen-xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Why Choose EcoLearn?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the features that make our platform the perfect choice for your sustainable learning journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}