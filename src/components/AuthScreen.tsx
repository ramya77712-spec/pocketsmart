import React, { useState } from 'react';
import { PiggyBank, Eye, EyeOff, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { signInWithEmail, signUpWithEmail } from '../config/supabase';
import toast from 'react-hot-toast';

interface AuthScreenProps {
  onLogin: (user: { id: string; name: string; email: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { user } = await signInWithEmail(formData.email, formData.password);
        if (user) {
          onLogin({
            id: user.id,
            name: user.user_metadata?.name || formData.email.split('@')[0],
            email: user.email!
          });
          toast.success('Welcome back!');
        }
      } else {
        const { user } = await signUpWithEmail(formData.email, formData.password, formData.name);
        if (user) {
          onLogin({
            id: user.id,
            name: formData.name,
            email: user.email!
          });
          toast.success('Account created successfully!');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific Supabase auth errors
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.message?.includes('User already registered')) {
        toast.error('An account with this email already exists.');
      } else if (error.message?.includes('Password should be at least')) {
        toast.error('Password must be at least 6 characters long.');
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@savingspilot.com',
      password: 'demo123',
      name: 'Demo User'
    });
    
    // Auto-submit after setting demo credentials
    setTimeout(() => {
      const user = {
        id: 'demo-user-' + Date.now(),
        name: 'Demo User',
        email: 'demo@savingspilot.com'
      };
      
      onLogin(user);
      toast.success('Welcome to SavingsPilot Demo!');
    }, 500);
  };

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-4"
          >
            <PiggyBank className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            {isLogin ? t('auth.welcomeBack') : t('auth.getStarted')}
          </h1>
          
          <p className="text-sm text-gray-600">
            Your Intelligent Financial Coaching Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                onClick={() => setShowForgotPassword(true)}
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                {t('common.loading')}
              </>
            ) : (
              isLogin ? t('auth.signIn') : t('auth.signUp')
            )}
          </motion.button>
        </form>

        {/* Toggle between login and signup */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({ email: '', password: '', name: '' });
              }}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600">
              Try the demo:
            </p>
            <button
              onClick={handleDemoLogin}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Use Demo Account
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Email: demo@savingspilot.com<br />
            Password: demo123
          </p>
        </div>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </motion.div>
    </div>
  );
};