import React from 'react';
import { Shield, Download, Trash2, Eye, Users } from 'lucide-react';
import { UserProfile } from '../types';
import { firebaseService } from '../services/firebaseService';

interface PrivacyControlsProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const PrivacyControls: React.FC<PrivacyControlsProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const updatePrivacy = (key: string, value: any) => {
    onUpdateProfile({
      preferences: {
        ...userProfile.preferences,
        privacy: {
          ...userProfile.preferences.privacy,
          [key]: value
        }
      }
    });
  };

  const exportData = async () => {
    try {
      const data = await firebaseService.exportUserData(userProfile.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${userProfile.name}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const deleteAllData = async () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      try {
        await firebaseService.deleteUserData(userProfile.id);
        // Redirect to home or show success message
        window.location.reload();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Privacy & Data Controls</h2>
      </div>

      <div className="space-y-6">
        {/* Data Sharing Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sharing Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-800">Share Progress</h4>
                  <p className="text-sm text-gray-600">Allow others to see your financial progress</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.preferences.privacy.shareProgress}
                  onChange={(e) => updatePrivacy('shareProgress', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-800">Team Invites</h4>
                  <p className="text-sm text-gray-600">Allow others to invite you to teams</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.preferences.privacy.allowTeamInvites}
                  onChange={(e) => updatePrivacy('allowTeamInvites', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Retention</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keep my data for (days)
            </label>
            <select
              value={userProfile.preferences.privacy.dataRetention}
              onChange={(e) => updatePrivacy('dataRetention', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
              <option value={1095}>3 years</option>
              <option value={-1}>Forever</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Data will be automatically deleted after this period of inactivity
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
          <div className="space-y-3">
            <button
              onClick={exportData}
              className="flex items-center gap-3 w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <h4 className="font-medium">Export My Data</h4>
                <p className="text-sm opacity-80">Download all your financial data</p>
              </div>
            </button>

            <button
              onClick={deleteAllData}
              className="flex items-center gap-3 w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <h4 className="font-medium">Delete All Data</h4>
                <p className="text-sm opacity-80">Permanently remove all your information</p>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">How We Use Your Data</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Financial data is used only for personalized coaching and insights</li>
            <li>• AI conversations are processed to improve recommendations</li>
            <li>• No data is sold to third parties</li>
            <li>• All data is encrypted and stored securely</li>
            <li>• You can delete your data at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};