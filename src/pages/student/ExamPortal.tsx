import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Clock } from 'lucide-react';
import { useToaster } from '../../components/ui/Toaster';

export default function ExamPortal() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToaster();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasFocus, setHasFocus] = useState(true);

  const { data: exam, isLoading } = useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/exams/${examId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch exam');
      return response.json();
    },
  });

  useEffect(() => {
    if (exam?.duration_minutes) {
      setTimeLeft(exam.duration_minutes * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        submitExam(true);
      }
    };

    const handleFocus = () => setHasFocus(true);
    const handleBlur = () => {
      setHasFocus(false);
      submitExam(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const submitExam = async (cheatingDetected = false) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/exams/${examId}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ answers, cheatingDetected }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit exam');

      const result = await response.json();
      navigate(`/exams/${examId}/result`, { state: result });
    } catch (error) {
      showToast('Failed to submit exam', 'error');
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
          <div className="flex items-center text-emerald-600 font-semibold">
            <Clock className="h-5 w-5 mr-2" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <p className="mt-2 text-gray-600">{exam.description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {exam.questions.map((question: any, index: number) => (
          <div
            key={question.id}
            className="bg-white rounded-xl shadow-sm p-6"
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-3">
              {['a', 'b', 'c', 'd'].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">
                    {question[`option_${option}`]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => submitExam(false)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          Submit Exam
        </button>
      </div>

      {/* Warning Message */}
      {!hasFocus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl max-w-md text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Cheating Detected
            </h2>
            <p className="text-gray-600">
              Your exam has been automatically submitted due to detected cheating
              attempt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}