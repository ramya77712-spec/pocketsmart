import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resetPassword } from '../config/supabase';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordForm {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    
    try {
      await resetPassword(data.email);
      setStep('success');
      toast.success('Password reset email sent successfully!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setStep('error');
      
      // Handle specific Supabase errors
      if (error.message?.includes('rate limit')) {
        toast.error('Too many requests. Please wait before trying again.');
      } else if (error.message?.includes('not found')) {
        toast.error('No account found with this email address.');
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setIsLoading(false);
    reset();
    onClose();
  };

  const handleRetry = () => {
    setStep('form');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden bg-white"
            role="dialog"
            aria-labelledby="forgot-password-title"
            aria-describedby="forgot-password-description"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
                  aria-label="Close modal"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2
                    id="forgot-password-title"
                    className="text-xl font-bold text-gray-900"
                  >
                    {step === 'form' ? 'Reset Password' : 
                     step === 'success' ? 'Check Your Email' : 'Reset Failed'}
                  </h2>
                  <p
                    id="forgot-password-description"
                    className="text-sm text-gray-600"
                  >
                    {step === 'form' ? 'Enter your email to receive reset instructions' :
                     step === 'success' ? 'We sent you a password reset link' :
                     'Something went wrong'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="block text-sm font-medium mb-2 text-gray-700"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          id="reset-email"
                          type="email"
                          {...register('email')}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors duration-200 ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                          } focus:ring-2 focus:ring-opacity-20 focus:outline-none`}
                          placeholder="Enter your email address"
                          disabled={isLoading}
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isValid || isLoading}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        isValid && !isLoading
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Sending Reset Email...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Send Reset Email
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        Email Sent Successfully!
                      </h3>
                      <p className="text-sm text-gray-600">
                        We've sent a password reset link to{' '}
                        <span className="font-medium">{getValues('email')}</span>
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Check your email and click the reset link to create a new password.
                        The link will expire in 1 hour.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Got it, thanks!
                    </button>
                  </motion.div>
                )}

                {step === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        Reset Failed
                      </h3>
                      <p className="text-sm text-gray-600">
                        We couldn't send the reset email. Please check your email address and try again.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleRetry}
                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};