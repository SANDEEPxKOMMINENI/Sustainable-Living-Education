import React from 'react';
import { Camera, Mail, MapPin, Calendar } from 'lucide-react';

// Using a data URL for default avatar to avoid file import issues
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatar_url?: string;
    location?: string;
    joined_date: string;
  };
  onImageUpload: (file: File) => void;
}

export default function ProfileHeader({
  user,
  onImageUpload,
}: ProfileHeaderProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      onImageUpload(file);
    }
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-t-xl" />

      <div className="px-6 pb-6">
        {/* Profile Image */}
        <div className="relative -mt-24 w-40 h-40 mx-auto">
          <img
            src={user.avatar_url || DEFAULT_AVATAR}
            alt={user.name}
            className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
          <label className="absolute bottom-2 right-2 bg-emerald-600 p-2 rounded-full text-white cursor-pointer hover:bg-emerald-700 transition-colors">
            <Camera className="h-5 w-5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* User Info */}
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <div className="mt-2 flex items-center justify-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>{user.email}</span>
            </div>
            {user.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Joined {new Date(user.joined_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}