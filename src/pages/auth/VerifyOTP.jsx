import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Mail, Clock, RefreshCw, CheckCircle } from 'lucide-react';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthUser } = useAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(300);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Please register first');
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (otpExpiry <= 0) return;

    const timer = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('OTP has expired. Please request a new one.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiry]);

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    if (otpExpiry <= 0) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        otp: otpCode,
      });

      if (response.data.success && response.data.data?.user) {
        toast.success(response.data.message || 'Email verified successfully!');
        
        setAuthUser(response.data.data.user);
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 300);
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);

      if (error.response?.data?.data?.attemptsLeft !== undefined) {
        setAttemptsLeft(error.response.data.data.attemptsLeft);
      }

      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      const response = await api.post('/auth/resend-otp', { email });

      toast.success(response.data.message || 'New OTP sent to your email!');

      setOtpExpiry(300);
      setResendTimer(120);
      setCanResend(false);
      setAttemptsLeft(5);

      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-2 sm:mb-4">
                <Mail className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">Verify Your Email</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                We've sent a 6-digit code to
              </p>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold break-all px-2">{email}</p>
            </div>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleVerify} className="space-y-3 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex gap-1 sm:gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-9 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      disabled={loading || otpExpiry <= 0}
                    />
                  ))}
                </div>
              </div>

              <div className={`flex items-center justify-center gap-2 text-xs sm:text-sm ${
                otpExpiry <= 60 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>
                  Code expires in: <strong>{formatTime(otpExpiry)}</strong>
                </span>
              </div>

              {attemptsLeft < 5 && (
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-orange-600">
                  <span>[WARNING] {attemptsLeft} attempts remaining</span>
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                disabled={otp.join('').length !== 6 || otpExpiry <= 0}
                className="w-full min-h-[44px]"
              >
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Verify Email
              </Button>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${resendLoading ? 'animate-spin' : ''}`} />
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Resend available in <strong>{formatTime(resendTimer)}</strong>
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-4">
                <p className="text-xs sm:text-sm leading-relaxed text-blue-800">
                  <strong className="block mb-1">[TIP] Tips:</strong>
                  <span className="block">• Check your spam folder if you don't see the email</span>
                  <span className="block">• Code is valid for 5 minutes</span>
                  <span className="block">• You can resend after 2 minutes</span>
                  <span className="block">• Maximum 5 verification attempts</span>
                </p>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
