import React from 'react';
import { User, BookOpen, Award, Clock } from 'lucide-react';
import type { UserProfile as UserProfileType } from '../../types';

interface UserProfileProps {
  profile: UserProfileType;
}

export default function UserProfile({ profile }: UserProfileProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'}
              alt={profile.name}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.bio && <p className="mt-2 text-gray-700">{profile.bio}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="text-green-600" size={20} />
              <h3 className="font-semibold">Enrolled Courses</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{profile.enrolledCourses.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="text-green-600" size={20} />
              <h3 className="font-semibold">Certificates</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{profile.certificates.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="text-green-600" size={20} />
              <h3 className="font-semibold">Hours Learned</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">48</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
            <div className="space-y-4">
              {profile.enrolledCourses.map((course) => (
                <div key={course.courseId} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{course.courseId}</h3>
                    <span className="text-sm text-gray-600">
                      {Math.round((course.completedLessons.length / 10) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(course.completedLessons.length / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Certificates</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.certificates.map((cert) => (
                <div key={cert.courseId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{cert.courseId}</h3>
                      <p className="text-sm text-gray-600">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}