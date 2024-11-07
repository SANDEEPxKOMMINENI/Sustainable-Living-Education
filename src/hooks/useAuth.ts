import useAuthStore from '../store/authStore';

export function useAuth() {
  const { user, loading, login, logout, register } = useAuthStore();
  return { user, loading, login, logout, register };
}