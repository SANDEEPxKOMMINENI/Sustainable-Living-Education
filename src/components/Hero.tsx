import React from 'react';
import { ArrowRight, Play, Users, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50/50"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-green-100/20"></div>
      </div>
      
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm leading-6 text-green-700 ring-1 ring-inset ring-green-600/10">
              <span>New Course Available</span>
              <ArrowRight className="ml-1" size={14} />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 leading-tight lg:text-6xl">
              Learn to Live
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Sustainably</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl">
              Join our community of environmental champions and learn practical ways to make a positive impact on our planet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-300">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </button>
              
              <button className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors duration-300">
                <Play size={20} className="mr-2" />
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="text-green-600" size={24} />
                <div>
                  <p className="text-2xl font-bold">10k+</p>
                  <p className="text-sm text-gray-600">Active Learners</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <BookOpen className="text-green-600" size={24} />
                <div>
                  <p className="text-2xl font-bold">100+</p>
                  <p className="text-sm text-gray-600">Expert Courses</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-50 to-teal-50/50 rounded-xl blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000"
              alt="Sustainable Living"
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}