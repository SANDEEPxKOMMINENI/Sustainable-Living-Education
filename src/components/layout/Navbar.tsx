import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="font-bold text-xl">EcoLearn</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/courses"
                  className="hover:bg-emerald-700 px-3 py-2 rounded-md"
                >
                  Courses
                </Link>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="hover:bg-emerald-700 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="hover:bg-emerald-700 p-2 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={logout}
                    className="hover:bg-emerald-700 p-2 rounded-full"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="hover:bg-emerald-700 px-4 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}