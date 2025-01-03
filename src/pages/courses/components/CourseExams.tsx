import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, AlertCircle } from 'lucide-react';

interface Exam {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  attempts?: {
    score: number;
    passed: boolean;
    completed_at: string;
  }[];
}

interface CourseExamsProps {
  exams: Exam[];
  isEnrolled: boolean;
  courseProgress: number;
}

export default function CourseExams({
  exams,
  isEnrolled,
  courseProgress,
}: CourseExamsProps) {
  const navigate = useNavigate();

  const canTakeExam = (exam: Exam) => {
    return courseProgress >= 100 && (!exam.attempts || exam.attempts.length === 0 || !exam.attempts.some(a => a.passed));
  };

  const getExamStatus = (exam: Exam) => {
    if (!exam.attempts || exam.attempts.length === 0) {
      return { status: 'pending', message: 'Not attempted' };
    }

    const lastAttempt = exam.attempts[exam.attempts.length - 1];
    if (lastAttempt.passed) {
      return { status: 'passed', message: `Passed with ${lastAttempt.score}%` };
    }
    return { status: 'failed', message: `Last attempt: ${lastAttempt.score}%` };
  };

  if (!isEnrolled) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Exams</h2>

      {courseProgress < 100 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Complete all lessons to unlock the final exam</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {exams.map((exam) => {
          const { status, message } = getExamStatus(exam);
          return (
            <div
              key={exam.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{exam.description}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'passed'
                      ? 'bg-green-100 text-green-800'
                      : status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{exam.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Pass: {exam.passing_score}%</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/exams/${exam.id}`)}
                  disabled={!canTakeExam(exam)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    canTakeExam(exam)
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {status === 'passed' ? 'Retake Exam' : 'Start Exam'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}