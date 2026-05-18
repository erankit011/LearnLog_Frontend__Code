import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import { Camera, Lock, User, Trash2 } from 'lucide-react';
import { getAvatarUrl } from '../../utils/getAvatarUrl';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    bio: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (profileForm.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (profileForm.bio && profileForm.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await api.patch('/users/update-profile', profileForm);
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const response = await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(response.data.data.user);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordModalOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/users/delete-account');
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-0 py-4 sm:py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">Profile Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleProfileSubmit} className="space-y-6 sm:space-y-7">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 pb-6 border-b border-gray-200">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center ring-4 ring-blue-50">
                  {user.avatar ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt="Avatar"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-semibold text-blue-700">
                      {user.fullName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 sm:p-2.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-all">
                  <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  {user.fullName}
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  {user.email}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Click the camera icon to upload a new avatar (max 5MB)
                </p>
              </div>
            </div>

            <Input
              label="Full Name"
              value={profileForm.fullName}
              onChange={(e) => {
                setProfileForm({ ...profileForm, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              error={errors.fullName}
              required
              className="min-h-[44px]"
            />

            <Textarea
              label="Bio"
              value={profileForm.bio}
              onChange={(e) => {
                setProfileForm({ ...profileForm, bio: e.target.value });
                if (errors.bio) setErrors({ ...errors, bio: '' });
              }}
              error={errors.bio}
              helperText={!errors.bio ? `${profileForm.bio.length}/500 characters` : undefined}
              rows={5}
            />

            <Button type="submit" isLoading={loading} className="w-full sm:w-auto min-h-[44px]">
              Save Changes
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-gray-600">
              Keep your account secure by using a strong password
            </p>
            <Button
              variant="secondary"
              onClick={() => setPasswordModalOpen(true)}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg sm:text-xl font-semibold text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            onClick={() => setDeleteModalOpen(true)}
            className="w-full sm:w-auto min-h-[44px]"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardBody>
      </Card>

      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setErrors({});
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) => {
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value });
              if (errors.oldPassword) setErrors({ ...errors, oldPassword: '' });
            }}
            error={errors.oldPassword}
            required
            className="min-h-[44px]"
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => {
              setPasswordForm({ ...passwordForm, newPassword: e.target.value });
              if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
            }}
            error={errors.newPassword}
            helperText={!errors.newPassword ? "Must be at least 6 characters" : undefined}
            required
            className="min-h-[44px]"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => {
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
            required
            className="min-h-[44px]"
          />
          <Button type="submit" isLoading={loading} className="w-full min-h-[44px]">
            Change Password
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-5">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Are you sure you want to delete your account? All of your data will be permanently
            removed. This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              className="w-full sm:flex-1 min-h-[44px]"
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} className="w-full sm:flex-1 min-h-[44px]">
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
