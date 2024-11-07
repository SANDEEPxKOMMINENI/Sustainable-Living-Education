import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CTASection() {
  const benefits = [
    "Access to all courses",
    "Personal mentor support",
    "Project-based learning",
    "Certificate of completion"
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute right-0 top-0 -mt-24 -mr-24 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-screen-xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Ready to Start Your Sustainable Journey?
            </h2>
            <p className="text-green-50 text-lg">
              Join thousands of learners already making an impact on the environment through education and action.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-green-300" size={20} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-white text-green-600 rounded-full hover:bg-green-50 transition-colors duration-300">
                Start Learning Today
                <ArrowRight className="ml-2" size={20} />
              </button>
              
              <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium border-2 border-white text-white rounded-full hover:bg-white/10 transition-colors duration-300">
                View Courses
              </button>
            </div>
          </div>
          
          <div className="relative lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Learning Together"
              className="rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}