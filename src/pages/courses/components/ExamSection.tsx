import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, AlertCircle } from 'lucide-react';

interface ExamSectionProps {
  examData: any;
  courseId: string | undefined;
}

export default function ExamSection({ examData, courseId }: ExamSectionProps) {
  const navigate = useNavigate();

  if (!examData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Exam</h2>
        <div className="flex items-center justify-center text-gray-500 py-8">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>No exam available for this course yet</span>
        </div>
      </div>
    );
  }

  const handleStartExam = () => {
    navigate(`/exams/${examData.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Exam</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {examData.title}
          </h3>
          <p className="text-gray-600">{examData.description}</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 text-emerald-600 mr-2" />
            <span>{examData.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Award className="h-5 w-5 text-emerald-600 mr-2" />
            <span>Passing Score: {examData.passing_score}%</span>
          </div>
        </div>

        {examData.lastAttempt ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Your Last Attempt</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    examData.lastAttempt.passed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {examData.lastAttempt.passed ? 'Passed' : 'Failed'}
                </span>
                <span className="text-gray-600">
                  Score: {examData.lastAttempt.score}%
                </span>
              </div>
              {examData.lastAttempt.certificateId && (
                <button
                  onClick={() =>
                    navigate(
                      `/certificates/${examData.lastAttempt.certificateId}`
                    )
                  }
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View Certificate
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={handleStartExam}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Start Exam
          </button>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li>Ensure you have a stable internet connection</li>
            <li>You cannot pause or resume the exam once started</li>
            <li>Browser tab switching or window minimizing is not allowed</li>
            <li>Keep track of the time limit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}