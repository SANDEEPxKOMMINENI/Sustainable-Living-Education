import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ExamSubmission, Exam } from '../../types/auth';

interface ExamResultsProps {
  submission: ExamSubmission;
  exam: Exam;
}

export default function ExamResults({ submission, exam }: ExamResultsProps) {
  const percentage = (submission.score / exam.questions.length) * 100;
  const passed = percentage >= exam.passingPercentage;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          {passed ? (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning'}
          </h2>
          <p className="text-gray-600">
            {passed
              ? "You've successfully passed the exam!"
              : "Don't worry, you can try again after reviewing the material."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-1">Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {submission.score}/{exam.questions.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-1">Percentage</p>
            <p className="text-2xl font-bold text-gray-900">{percentage.toFixed(1)}%</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Question Summary</h3>
          <div className="space-y-4">
            {exam.questions.map((question, index) => {
              const userAnswer = submission.answers[question.id];
              const isCorrect = userAnswer === question.correctOption;

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-start">
                    <span
                      className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium ${
                        isCorrect
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="ml-3">
                      <p className="text-gray-900 mb-2">{question.text}</p>
                      <p className="text-sm">
                        <span className="font-medium">Your answer: </span>
                        {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 mt-1">
                          <span className="font-medium">Correct answer: </span>
                          {question.options[question.correctOption]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}