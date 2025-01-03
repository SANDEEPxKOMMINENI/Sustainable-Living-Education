import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, XCircle, Download } from 'lucide-react';

export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const downloadCertificate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/certificates/${result.certificateId}`,
        {
          credentials: 'include',
        }
      );
      
      if (!response.ok) throw new Error('Failed to download certificate');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${result.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        {result.passed ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              You have passed the exam with a score of {result.score}%
            </p>
            {result.certificateId && (
              <button
                onClick={downloadCertificate}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Certificate
              </button>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Exam Not Passed
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your score: {result.score}%. Required: 65%
            </p>
            <p className="text-gray-600 mb-6">
              You'll need to re-enroll in the course to retake the exam.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Browse Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
}