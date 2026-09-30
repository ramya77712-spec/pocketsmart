import React, { useState, useEffect } from 'react';
import { Eye, Type, Palette, Volume2, Keyboard, Focus, MousePointer } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';
import { useTranslation } from 'react-i18next';

interface AccessibilityPanelProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const { t } = useTranslation();
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--font-scale', 
      userProfile.preferences.accessibility.fontSize === 'small' ? '0.875' :
      userProfile.preferences.accessibility.fontSize === 'large' ? '1.125' : '1'
    );
    
    // High contrast
    if (userProfile.preferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (userProfile.preferences.accessibility.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01s');
    } else {
      root.style.removeProperty('--animation-duration');
    }
    
    // Focus visible
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusVisible(true);
      }
    };
    
    const handleMouseDown = () => {
      setFocusVisible(false);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [userProfile.preferences.accessibility]);

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

  const accessibilityFeatures = [
    {
      id: 'highContrast',
      title: 'High Contrast Mode',
      description: 'Increase contrast for better visibility',
      icon: <Palette className="w-5 h-5" />,
      type: 'toggle',
      value: userProfile.preferences.accessibility.highContrast,
      onChange: (value: boolean) => updateAccessibility('highContrast', value)
    },
    {
      id: 'reducedMotion',
      title: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: <MousePointer className="w-5 h-5" />,
      type: 'toggle',
      value: userProfile.preferences.accessibility.reducedMotion,
      onChange: (value: boolean) => updateAccessibility('reducedMotion', value)
    },
    {
      id: 'screenReader',
      title: 'Screen Reader Optimized',
      description: 'Enhanced ARIA labels and descriptions',
      icon: <Volume2 className="w-5 h-5" />,
      type: 'toggle',
      value: userProfile.preferences.accessibility.screenReader,
      onChange: (value: boolean) => updateAccessibility('screenReader', value)
    }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small (14px)', preview: 'Aa' },
    { value: 'medium', label: 'Medium (16px)', preview: 'Aa' },
    { value: 'large', label: 'Large (18px)', preview: 'Aa' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Accessibility Settings
        </h2>
      </div>

      {/* Accessibility Features */}
      <div className="space-y-6 mb-8">
        {accessibilityFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={feature.value}
                onChange={(e) => feature.onChange(e.target.checked)}
                className="sr-only peer"
                aria-label={feature.title}
              />
              <div className={`w-11 h-6 rounded-full peer transition-colors ${
                feature.value 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200'
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      {/* Font Size Control */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gray-100">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              Font Size
            </h3>
            <p className="text-sm text-gray-600">
              Adjust text size for better readability
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => updateAccessibility('fontSize', size.value)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                userProfile.preferences.accessibility.fontSize === size.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
              aria-label={`Set font size to ${size.label}`}
            >
              <div className={`text-2xl font-bold mb-2 ${
                size.value === 'small' ? 'text-sm' :
                size.value === 'large' ? 'text-xl' : 'text-base'
              }`}>
                {size.preview}
              </div>
              <p className="text-xs text-gray-600">
                {size.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Navigation Help */}
      <div className="p-4 rounded-lg bg-blue-50">
        <div className="flex items-center gap-2 mb-3">
          <Keyboard className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">
            Keyboard Navigation
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="text-gray-700">
            <p><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Tab</kbd> Navigate forward</p>
            <p><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Shift+Tab</kbd> Navigate backward</p>
          </div>
          <div className="text-gray-700">
            <p><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Enter</kbd> Activate button</p>
            <p><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Esc</kbd> Close modal</p>
          </div>
        </div>
      </div>

      {/* Focus Indicator Demo */}
      {focusVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <Focus className="w-4 h-4" />
            <span className="text-sm">Keyboard navigation active</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};