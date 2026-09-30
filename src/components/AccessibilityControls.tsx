import React from 'react';
import { Eye, Type, Palette, Volume2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AccessibilityControlsProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const updateAccessibility = (key: string, value: any) => {
    onUpdateProfile({
      preferences: {
        ...userProfile.preferences,
        accessibility: {
          ...userProfile.preferences.accessibility,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Accessibility Settings</h2>
      </div>

      <div className="space-y-6">
        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-800">High Contrast Mode</h3>
              <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile.preferences.accessibility.highContrast}
              onChange={(e) => updateAccessibility('highContrast', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-800">Reduced Motion</h3>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile.preferences.accessibility.reducedMotion}
              onChange={(e) => updateAccessibility('reducedMotion', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Type className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-800">Font Size</h3>
              <p className="text-sm text-gray-600">Adjust text size for better readability</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => updateAccessibility('fontSize', size)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userProfile.preferences.accessibility.fontSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Screen Reader Support */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-800">Screen Reader Optimized</h3>
              <p className="text-sm text-gray-600">Enhanced ARIA labels and descriptions</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile.preferences.accessibility.screenReader}
              onChange={(e) => updateAccessibility('screenReader', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};