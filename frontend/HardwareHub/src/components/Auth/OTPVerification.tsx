import { useState } from 'react';
import { Shield, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onVerified: (user: any, token: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function OTPVerification({ 
  email, 
  onVerified, 
  onBack, 
  isLoading = false 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const otpCode = otp.join('');
      
      if (otpCode.length !== 6) {
        throw new Error('Please enter all 6 digits');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      onVerified(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Verification Code
          </label>
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isSubmitting || isLoading}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isLoading || otp.join('').length !== 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Verify & Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending || isSubmitting}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
          >
            {isResending ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Email
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            For demo purposes, any 6-digit code will work
          </p>
        </div>
      </div>
    </div>
  );
}