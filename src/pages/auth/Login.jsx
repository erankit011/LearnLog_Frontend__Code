import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { showSuccess, showError, showWarning } from '../../utils/toastNotification';
import api from '../../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerificationError, setShowVerificationError] = useState(false);
  const [showRateLimitError, setShowRateLimitError] = useState(false);
  const [resendingOTP, setResendingOTP] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setShowVerificationError(false);
    setShowRateLimitError(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResendOTP = async () => {
    setResendingOTP(true);
    try {
      await api.post('/auth/resend-otp', { email: formData.email });
      showSuccess('OTP sent to your email!');
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showWarning('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    setShowVerificationError(false);
    setShowRateLimitError(false);

    const result = await login(formData);

    setIsLoading(false);

    if (result.success) {
      showSuccess('Login successful!');
      navigate('/dashboard');
    } else if (result.requiresOTP || result.requiresVerification) {
      showWarning('Please verify your email with the OTP sent');
      navigate('/verify-otp', { state: { email: result.email || formData.email } });
    } else if (result.rateLimited) {
      setShowRateLimitError(true);
      showError('Too many login attempts. Please wait a few minutes.');
    } else {
      if (result.message && result.message.toLowerCase().includes('verify')) {
        setShowVerificationError(true);
      } else {
        setErrors({ email: result.message || 'Login failed' });
        showError(result.message || 'Login failed');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Welcome back</h2>
        <p className="text-sm sm:text-base text-gray-600">Sign in to your account to continue</p>
      </div>

      {showVerificationError && (
        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                Email Not Verified
              </h3>
              <p className="text-xs sm:text-sm text-yellow-700 mb-3">
                Please verify your email address to continue. We've sent a verification code to your email.
              </p>
              <Button
                onClick={handleResendOTP}
                isLoading={resendingOTP}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                Resend Verification Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRateLimitError && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Too Many Login Attempts
              </h3>
              <p className="text-xs sm:text-sm text-red-700">
                You've tried to login too many times. Please wait a few minutes before trying again.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          icon={Mail}
          className="min-h-[44px]"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            icon={Lock}
            className="min-h-[44px]"
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full min-h-[44px]">
          Sign In
        </Button>
      </form>

      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
