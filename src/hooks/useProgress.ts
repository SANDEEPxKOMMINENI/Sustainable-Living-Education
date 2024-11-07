import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courses } from '../api/courses';
import type { Progress } from '../types';

export function useProgress(courseId: string) {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: async () => {
      const response = await courses.getProgress(courseId);
      return response.data;
    }
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: string) => 
      courses.markLessonComplete(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] });
    }
  });

  const markLessonComplete = async (lessonId: string) => {
    try {
      await completeLessonMutation.mutateAsync(lessonId);
      return true;
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
      throw error;
    }
  };

  return {
    progress,
    loading: isLoading,
    markLessonComplete,
    isUpdating: completeLessonMutation.isPending
  };
}