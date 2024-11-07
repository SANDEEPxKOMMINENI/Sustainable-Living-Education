import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Exam, Question } from '../../types/auth';
import useAuthStore from '../../store/authStore';

interface ExamPortalProps {
  exam: Exam;
  onSubmit: (answers: { [questionId: string]: number }) => void;
}

export default function ExamPortal({ exam, onSubmit }: ExamPortalProps) {
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    // Prevent tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('Warning: Switching tabs is not allowed during the exam!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Prevent copy/paste
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handleCopy);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handleCopy);
    };
  }, []);

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock size={20} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-8">
          {exam.questions.map((question: Question, index: number) => (
            <div key={question.id} className="border-b pb-6">
              <div className="flex items-start mb-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-800 rounded-full font-medium">
                  {index + 1}
                </span>
                <p className="ml-4 text-lg text-gray-900">{question.text}</p>
              </div>

              <div className="ml-12 space-y-3">
                {question.options.map((option: string, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={optionIndex}
                      checked={answers[question.id] === optionIndex}
                      onChange={() =>
                        setAnswers({ ...answers, [question.id]: optionIndex })
                      }
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center text-yellow-600">
            <AlertCircle size={20} className="mr-2" />
            <span className="text-sm">
              Warning: Switching tabs or copying/pasting is not allowed
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}