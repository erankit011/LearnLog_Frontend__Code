import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          We've sent a password reset link to {email}
        </p>
        <p className="text-xs sm:text-sm text-gray-600">
          Please check your inbox and follow the instructions to reset your password.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Forgot password?</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
        Enter your email and we'll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Send reset link
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

export default ForgotPassword;
