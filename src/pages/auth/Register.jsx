import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, Lock, User } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastNotification';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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

    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.success) {
      showSuccess('Account created successfully! Please verify your email.');
      navigate('/verify-otp', { state: { email: formData.email } });
    } else {
      showError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Create account</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Start your learning journey today</p>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="John Doe"
          icon={User}
          value={formData.fullName}
          onChange={handleChange}
          autoComplete="name"
          error={errors.fullName}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
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
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-4 sm:mt-6">
          Create account
        </Button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
