import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToaster } from '../../components/ui/Toaster';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileForm from '../../components/profile/ProfileForm';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToaster();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: '',
    phone: '',
    website: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:3000/api/users/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      showToast('Profile picture updated successfully', 'success');
    } catch (error) {
      showToast('Failed to upload profile picture', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProfileHeader
          user={{
            ...user!,
            location: formData.location,
            joined_date: user?.created_at || new Date().toISOString(),
          }}
          onImageUpload={handleImageUpload}
        />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>

          <ProfileForm
            formData={formData}
            isEditing={isEditing}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    </div>
  );
}