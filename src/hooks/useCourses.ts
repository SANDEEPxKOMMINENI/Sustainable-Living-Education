import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courses } from '../api/courses';
import type { Course } from '../types';

export function useCourses() {
  const queryClient = useQueryClient();

  const { data: courseList, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courses.getAll();
      return response.data;
    }
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => courses.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  const enrollInCourse = async (courseId: string) => {
    try {
      await enrollMutation.mutateAsync(courseId);
      return true;
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      throw error;
    }
  };

  return {
    courses: courseList || [],
    loading: isLoading,
    error: error ? 'Failed to fetch courses' : null,
    enrollInCourse,
    isEnrolling: enrollMutation.isPending
  };
}