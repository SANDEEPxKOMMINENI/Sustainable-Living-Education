import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useToaster } from '../../../components/ui/Toaster';
import ExamForm from './ExamForm';

export default function ExamManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const { showToast } = useToaster();
  const queryClient = useQueryClient();

  const {
    data: exams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/exams', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      return response.json();
    },
  });

  const deleteExamMutation = useMutation({
    mutationFn: async (examId: number) => {
      const response = await fetch(`http://localhost:3000/api/exams/${examId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete exam');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      showToast('Exam deleted successfully', 'success');
    },
    onError: (error) => {
      showToast(
        error instanceof Error ? error.message : 'Failed to delete exam',
        'error'
      );
    },
  });

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowExamForm(true);
  };

  const handleDeleteExam = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    deleteExamMutation.mutate(examId);
  };

  const handleCloseExamForm = () => {
    setShowExamForm(false);
    setSelectedExam(null);
  };

  const filteredExams = exams?.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load exams</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['exams'] })}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
        <button
          onClick={() => setShowExamForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          <span>Create Exam</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passing Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
                  </td>
                </tr>
              ) : (
                filteredExams?.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exam.course_title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exam.duration_minutes} minutes
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exam.passing_score}%
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditExam(exam)}
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showExamForm && (
        <ExamForm
          onClose={handleCloseExamForm}
          examId={selectedExam?.id}
          initialData={selectedExam}
        />
      )}
    </div>
  );
}