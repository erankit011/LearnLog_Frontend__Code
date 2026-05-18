import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const { token: resetToken } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post(`/auth/reset-password/${resetToken}`, {
        password: formData.password,
      });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Invalid reset link</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          This password reset link is invalid or has expired
        </p>
        <Link to="/forgot-password">
          <Button className="w-full">Request new link</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Reset password</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Enter your new password below</p>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          label="New Password"
          type="password"
          name="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText={!errors.password ? "Must be at least 6 characters" : undefined}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Reset password
        </Button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
        Remember your password?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
