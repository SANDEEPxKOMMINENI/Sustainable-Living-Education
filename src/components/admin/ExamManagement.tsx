import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Exam } from '../../types/auth';
import { adminApi } from '../../api/admin';

export default function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    courseId: '',
    duration: 60,
    passingPercentage: 70
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getExams();
      setExams(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch exams');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    try {
      const response = await adminApi.createExam(newExam);
      setExams([...exams, response.data]);
      setIsCreating(false);
      setNewExam({
        title: '',
        courseId: '',
        duration: 60,
        passingPercentage: 70
      });
    } catch (err) {
      console.error('Error creating exam:', err);
      alert('Failed to create exam');
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      await adminApi.deleteExam(id);
      setExams(exams.filter(exam => exam.id !== id));
    } catch (err) {
      console.error('Error deleting exam:', err);
      alert('Failed to delete exam');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
          <button 
            onClick={fetchExams}
            className="ml-4 text-sm underline hover:text-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Exam Management</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus size={18} className="mr-2" />
          Create Exam
        </button>
      </div>

      {isCreating && (
        <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Create New Exam</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newExam.title}
                onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course ID
              </label>
              <input
                type="text"
                value={newExam.courseId}
                onChange={(e) => setNewExam({ ...newExam, courseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newExam.duration}
                  onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Percentage
                </label>
                <input
                  type="number"
                  value={newExam.passingPercentage}
                  onChange={(e) => setNewExam({ ...newExam, passingPercentage: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExam}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Exam
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Course ID: {exam.courseId}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDeleteExam(exam.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Edit size={18} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="text-sm font-medium">{exam.duration} minutes</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Passing Score</span>
                  <span className="text-sm font-medium">{exam.passingPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Status:</span>
                {exam.questions?.length > 0 ? (
                  <span className="flex items-center text-sm text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    Ready ({exam.questions.length} questions)
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-yellow-600">
                    <XCircle size={16} className="mr-1" />
                    No Questions
                  </span>
                )}
              </div>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                Manage Questions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}