import React, { useState } from 'react';
import { Shield, Download, Trash2, Eye, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { databaseService } from '../services/database';
import { UserProfile } from '../types';
import toast from 'react-hot-toast';

interface PrivacyCenterProps {
  userProfile: UserProfile;
  onDataReset: () => void;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({
  userProfile,
  onDataReset,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataUsageConsent, setDataUsageConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const exportUserData = async () => {
    setIsExporting(true);
    try {
      const userData = await databaseService.exportUserData(userProfile.id);
      
      if (userData) {
        const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
          type: 'application/json'
        });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `savings-simulator-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.success('Your data has been exported successfully!');
      } else {
        toast.error('Failed to export data. Please try again.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const deleteAllData = async () => {
    setIsDeleting(true);
    try {
      const success = await databaseService.deleteUserData(userProfile.id);
      
      if (success) {
        toast.success('All your data has been deleted successfully.');
        onDataReset();
        setShowDeleteConfirmation(false);
      } else {
        toast.error('Failed to delete data. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const privacyFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Data Encryption',
      description: 'All your financial data is encrypted both in transit and at rest using industry-standard AES-256 encryption.',
      status: 'active'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'No Data Selling',
      description: 'We never sell your personal or financial information to third parties. Your data is yours alone.',
      status: 'active'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Storage',
      description: 'Your data is stored on secure, SOC 2 compliant servers with regular security audits and monitoring.',
      status: 'active'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'GDPR Compliant',
      description: 'We follow GDPR guidelines and respect your right to privacy, data portability, and deletion.',
      status: 'active'
    }
  ];

  const dataCategories = [
    {
      category: 'Profile Information',
      items: ['Name', 'Email', 'Persona selection', 'Preferences'],
      purpose: 'Personalization and account management'
    },
    {
      category: 'Financial Data',
      items: ['Income', 'Expenses', 'Savings goals', 'Emergency fund'],
      purpose: 'Providing personalized financial advice and simulations'
    },
    {
      category: 'Usage Analytics',
      items: ['Feature usage', 'Session duration', 'Learning progress'],
      purpose: 'Improving app functionality and user experience'
    },
    {
      category: 'AI Interactions',
      items: ['Chat history', 'Questions asked', 'Feedback provided'],
      purpose: 'Improving AI coach responses and personalization'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Privacy & Data Center</h2>
      </div>

      {/* Privacy Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Your Privacy Matters</h3>
        <p className="text-green-700">
          We are committed to protecting your privacy and giving you full control over your data. 
          This center provides transparency about what data we collect, how we use it, and gives you 
          tools to manage your information.
        </p>
      </div>

      {/* Privacy Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy & Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {privacyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="text-green-600">{feature.icon}</div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data We Collect & Why</h3>
        <div className="space-y-4">
          {dataCategories.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">{category.category}</h4>
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-1">Data collected:</p>
                <div className="flex flex-wrap gap-1">
                  {category.items.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Purpose:</strong> {category.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Management */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Consent Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Essential Data Usage</h4>
              <p className="text-sm text-gray-600">Required for core app functionality</p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Required</span>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Analytics & Improvements</h4>
              <p className="text-sm text-gray-600">Help us improve the app experience</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                analyticsConsent ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
              }`}>
                <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Data Rights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportUserData}
            disabled={isExporting}
            className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <Download className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-800">Export Your Data</h4>
              <p className="text-sm text-gray-600">Download all your data in JSON format</p>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="flex items-center gap-3 p-4 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-6 h-6 text-red-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-800">Delete All Data</h4>
              <p className="text-sm text-gray-600">Permanently remove all your information</p>
            </div>
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Questions About Privacy?</h3>
        <p className="text-blue-700 mb-3">
          If you have any questions about our privacy practices or need help with your data, 
          we're here to help.
        </p>
        <div className="flex gap-4">
          <a
            href="mailto:privacy@savingssimulator.ai"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            privacy@savingssimulator.ai
          </a>
          <a
            href="/privacy-policy"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Full Privacy Policy
          </a>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">Delete All Data</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              This action will permanently delete all your data including:
            </p>
            
            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
              <li>Profile information and preferences</li>
              <li>Financial data and goals</li>
              <li>Learning progress and achievements</li>
              <li>AI conversation history</li>
              <li>All badges and progress</li>
            </ul>
            
            <p className="text-red-600 font-medium mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAllData}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete All Data'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};