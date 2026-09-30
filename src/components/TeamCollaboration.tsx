import React, { useState } from 'react';
import { Users, Plus, Share2, Target, Crown, UserPlus } from 'lucide-react';
import { Team, UserProfile, FinancialGoal } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TeamCollaborationProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [mockTeam, setMockTeam] = useState<Team | null>(null);

  const createTeam = () => {
    if (!teamName.trim()) return;

    const newTeam: Team = {
      id: uuidv4(),
      name: teamName,
      description: teamDescription,
      members: [{
        userId: userProfile.id,
        name: userProfile.name,
        role: 'leader',
        joinedAt: new Date(),
        contribution: 0
      }],
      sharedGoals: [],
      createdAt: new Date(),
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    setMockTeam(newTeam);
    onUpdateProfile({
      teamId: newTeam.id,
      role: 'leader'
    });

    setShowCreateTeam(false);
    setTeamName('');
    setTeamDescription('');
  };

  const joinTeam = () => {
    if (!inviteCode.trim()) return;

    // Mock joining a team
    const mockJoinedTeam: Team = {
      id: uuidv4(),
      name: 'Financial Freedom Squad',
      description: 'Working together towards financial independence',
      members: [
        {
          userId: 'leader-id',
          name: 'Team Leader',
          role: 'leader',
          joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          contribution: 2500
        },
        {
          userId: userProfile.id,
          name: userProfile.name,
          role: 'member',
          joinedAt: new Date(),
          contribution: 0
        }
      ],
      sharedGoals: [
        {
          id: uuidv4(),
          name: 'Team Emergency Fund',
          targetAmount: 10000,
          currentAmount: 3500,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          category: 'emergency',
          priority: 'high'
        }
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      inviteCode: inviteCode.toUpperCase()
    };

    setMockTeam(mockJoinedTeam);
    onUpdateProfile({
      teamId: mockJoinedTeam.id,
      role: 'member'
    });

    setShowJoinTeam(false);
    setInviteCode('');
  };

  const currentTeam = mockTeam || (userProfile.teamId ? {
    id: userProfile.teamId,
    name: 'My Financial Team',
    description: 'Working together towards our goals',
    members: [
      {
        userId: userProfile.id,
        name: userProfile.name,
        role: userProfile.role || 'member',
        joinedAt: new Date(),
        contribution: userProfile.totalSaved
      }
    ],
    sharedGoals: [],
    createdAt: new Date(),
    inviteCode: 'DEMO123'
  } : null);

  if (!currentTeam) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Team Collaboration</h2>
        </div>

        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Join Forces for Financial Success</h3>
          <p className="text-gray-600 mb-6">
            Collaborate with friends, family, or colleagues to achieve shared financial goals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowCreateTeam(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
            <button
              onClick={() => setShowJoinTeam(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Join Team
            </button>
          </div>
        </div>

        {/* Create Team Modal */}
        {showCreateTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your team's goals"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateTeam(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTeam}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Team Modal */}
        {showJoinTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Join Existing Team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 6-character code"
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowJoinTeam(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={joinTeam}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{currentTeam.name}</h2>
            <p className="text-sm text-gray-600">{currentTeam.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {currentTeam.inviteCode}
          </span>
        </div>
      </div>

      {/* Team Members */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>
        <div className="space-y-2">
          {currentTeam.members.map((member) => (
            <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{member.name}</span>
                    {member.role === 'leader' && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <p className="text-xs text-gray-600">
                    Joined {member.joinedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">${member.contribution.toLocaleString()}</p>
                <p className="text-xs text-gray-600">contributed</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Goals */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shared Goals</h3>
        {currentTeam.sharedGoals.length > 0 ? (
          <div className="space-y-3">
            {currentTeam.sharedGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-gray-800">{goal.name}</h4>
                    </div>
                    <span className="text-sm text-gray-600">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Due: {goal.deadline.toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No shared goals yet</p>
            <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              Create First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};