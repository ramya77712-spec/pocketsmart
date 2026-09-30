import React, { useState } from 'react';
import { Share2, Download, Trophy, Users, MessageCircle, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserProfile, FinancialData } from '../types';
import { formatCurrency, calculateLevel } from '../utils/calculations';
import toast from 'react-hot-toast';

interface SocialFeaturesProps {
  userProfile: UserProfile;
  financialData: FinancialData;
  achievements: any[];
  progressData: any;
}

export const SocialFeatures: React.FC<SocialFeaturesProps> = ({
  userProfile,
  financialData,
  achievements,
  progressData,
}) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedShareType, setSelectedShareType] = useState<'progress' | 'achievement' | 'milestone'>('progress');

  const shareUrl = window.location.href;
  const appName = "Savings Simulator AI";

  const generateProgressReport = async (format: 'pdf' | 'png' | 'svg') => {
    setIsGeneratingReport(true);
    
    try {
      const reportElement = document.getElementById('progress-report');
      if (!reportElement) {
        toast.error('Report element not found');
        return;
      }

      if (format === 'pdf') {
        const canvas = await html2canvas(reportElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`financial-progress-${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (format === 'png') {
        const canvas = await html2canvas(reportElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const link = document.createElement('a');
        link.download = `financial-progress-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }

      toast.success(`Report generated successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const generateShareableContent = () => {
    const level = calculateLevel(userProfile.experience);
    const totalSaved = formatCurrency(userProfile.totalSaved);
    
    const content = {
      progress: {
        title: `🎯 My Financial Progress with ${appName}`,
        text: `I'm Level ${level} and have saved ${totalSaved}! 💰 Join me on my financial journey! #FinancialFreedom #SavingsGoals`,
        hashtags: ['FinancialFreedom', 'SavingsGoals', 'PersonalFinance', 'MoneyManagement']
      },
      achievement: {
        title: `🏆 New Achievement Unlocked!`,
        text: `Just earned "${userProfile.badges[userProfile.badges.length - 1]?.name}" badge! 🎉 Building better financial habits with ${appName}! #Achievement #FinancialGoals`,
        hashtags: ['Achievement', 'FinancialGoals', 'PersonalFinance', 'Success']
      },
      milestone: {
        title: `🎉 Financial Milestone Reached!`,
        text: `Celebrating my financial progress! Level ${level} with ${userProfile.badges.length} badges earned! 🏆 #FinancialMilestone #Progress`,
        hashtags: ['FinancialMilestone', 'Progress', 'PersonalFinance', 'Achievement']
      }
    };

    return content[selectedShareType];
  };

  const generateCertificate = async () => {
    const certificateData = {
      name: userProfile.name,
      level: calculateLevel(userProfile.experience),
      totalSaved: formatCurrency(userProfile.totalSaved),
      badgesEarned: userProfile.badges.length,
      streakDays: userProfile.streakDays,
      date: new Date().toLocaleDateString()
    };

    // Create certificate HTML
    const certificateHTML = `
      <div style="width: 800px; height: 600px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; color: white; font-family: Arial, sans-serif; text-align: center; position: relative;">
        <div style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <h1 style="font-size: 48px; margin-bottom: 20px; color: #FFD700;">Certificate of Achievement</h1>
          <p style="font-size: 24px; margin-bottom: 30px;">This certifies that</p>
          <h2 style="font-size: 36px; margin-bottom: 30px; color: #FFD700;">${certificateData.name}</h2>
          <p style="font-size: 20px; margin-bottom: 20px;">has successfully achieved</p>
          <div style="display: flex; justify-content: space-around; margin: 30px 0;">
            <div>
              <h3 style="font-size: 32px; color: #FFD700;">Level ${certificateData.level}</h3>
              <p>Financial Mastery</p>
            </div>
            <div>
              <h3 style="font-size: 32px; color: #FFD700;">${certificateData.totalSaved}</h3>
              <p>Total Saved</p>
            </div>
            <div>
              <h3 style="font-size: 32px; color: #FFD700;">${certificateData.badgesEarned}</h3>
              <p>Badges Earned</p>
            </div>
          </div>
          <p style="font-size: 18px; margin-top: 30px;">Awarded on ${certificateData.date}</p>
          <p style="font-size: 16px; margin-top: 20px; opacity: 0.8;">${appName} - Your Financial Success Partner</p>
        </div>
      </div>
    `;

    // Create temporary element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = certificateHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      link.download = `financial-achievement-certificate-${certificateData.date.replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Certificate generated successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate. Please try again.');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const shareContent = generateShareableContent();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Share Your Progress</h2>
      </div>

      {/* Hidden Progress Report for Export */}
      <div id="progress-report" className="hidden">
        <div className="bg-white p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Progress Report</h1>
            <p className="text-gray-600">{userProfile.name} • {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">{calculateLevel(userProfile.experience)}</h3>
              <p className="text-gray-600">Current Level</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">{formatCurrency(userProfile.totalSaved)}</h3>
              <p className="text-gray-600">Total Saved</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">{userProfile.badges.length}</h3>
              <p className="text-gray-600">Badges Earned</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">{userProfile.streakDays}</h3>
              <p className="text-gray-600">Day Streak</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userProfile.badges.slice(-3).map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-800">{badge.name}</h4>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            Generated by {appName} • {shareUrl}
          </div>
        </div>
      </div>

      {/* Share Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">What would you like to share?</h3>
        <div className="flex gap-2">
          {[
            { key: 'progress', label: 'Overall Progress', icon: '📊' },
            { key: 'achievement', label: 'Latest Achievement', icon: '🏆' },
            { key: 'milestone', label: 'Financial Milestone', icon: '🎯' }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedShareType(type.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedShareType === type.key
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Social Media Sharing */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Share on Social Media</h3>
        <div className="flex gap-3">
          <TwitterShareButton
            url={shareUrl}
            title={shareContent.text}
            hashtags={shareContent.hashtags}
            className="hover:scale-105 transition-transform"
          >
            <TwitterIcon size={40} round />
          </TwitterShareButton>

          <FacebookShareButton
            url={shareUrl}
            quote={shareContent.text}
            className="hover:scale-105 transition-transform"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <LinkedinShareButton
            url={shareUrl}
            title={shareContent.title}
            summary={shareContent.text}
            className="hover:scale-105 transition-transform"
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          <button
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: shareContent.title,
                    text: shareContent.text,
                    url: shareUrl
                  });
                } catch (error) {
                  console.error('Error sharing:', error);
                }
              } else {
                await navigator.clipboard.writeText(`${shareContent.text} ${shareUrl}`);
                toast.success('Content copied to clipboard!');
              }
            }}
            className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            title="Share via system"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Download Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Download Progress Report</h3>
        <div className="flex gap-3">
          <button
            onClick={() => generateProgressReport('pdf')}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF Report
          </button>
          <button
            onClick={() => generateProgressReport('png')}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            PNG Image
          </button>
          <button
            onClick={generateCertificate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Certificate
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Preview</h3>
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <h4 className="font-bold text-gray-800 mb-2">{shareContent.title}</h4>
          <p className="text-gray-600 mb-3">{shareContent.text}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ExternalLink className="w-4 h-4" />
            <span>{shareUrl}</span>
          </div>
        </div>
      </div>

      {isGeneratingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your report...</p>
          </div>
        </div>
      )}
    </div>
  );
};