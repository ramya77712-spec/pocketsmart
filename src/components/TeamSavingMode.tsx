import React, { useState, useEffect } from 'react';
import { Users, Plus, MessageCircle, Target, TrendingUp, Crown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, FinancialGoal } from '../types';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'leader' | 'member';
  contribution: number;
  joinedAt: Date;
  isOnline: boolean;
}

interface TeamGoal extends FinancialGoal {
  teamId: string;
  createdBy: string;
  contributors: { userId: string; amount: number }[];
}

interface TeamMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'achievement' | 'goal_update';
}

interface TeamSavingModeProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const TeamSavingMode: React.FC<TeamSavingModeProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTeam, setActiveTeam] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamGoals, setTeamGoals] = useState<TeamGoal[]>([]);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [teamCode, setTeamCode] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    deadline: '',
    category: 'custom' as const
  });

  useEffect(() => {
    // Load team data if user is part of a team
    loadTeamData();
  }, [userProfile.id]);

  const loadTeamData = async () => {
    // Mock team data - in production, this would come from your backend
    const mockTeam = {
      id: 'team-1',
      name: 'Financial Freedom Squad',
      code: 'FF2024',
      createdAt: new Date('2024-01-01'),
      description: 'Working together towards financial independence!'
    };

    const mockMembers: TeamMember[] = [
      {
        id: userProfile.id,
        name: userProfile.name,
        avatar: userProfile.name.charAt(0),
        role: 'leader',
        contribution: 2500,
        joinedAt: new Date('2024-01-01'),
        isOnline: true
      },
      {
        id: 'member-2',
        name: 'Sarah Johnson',
        avatar: 'S',
        role: 'member',
        contribution: 1800,
        joinedAt: new Date('2024-01-15'),
        isOnline: true
      },
      {
        id: 'member-3',
        name: 'Mike Chen',
        avatar: 'M',
        role: 'member',
        contribution: 2200,
        joinedAt: new Date('2024-02-01'),
        isOnline: false
      }
    ];

    const mockGoals: TeamGoal[] = [
      {
        id: 'goal-1',
        teamId: 'team-1',
        name: 'Emergency Fund Challenge',
        targetAmount: 15000,
        currentAmount: 6500,
        deadline: new Date('2024-12-31'),
        category: 'emergency',
        priority: 'high',
        createdBy: userProfile.id,
        contributors: [
          { userId: userProfile.id, amount: 2500 },
          { userId: 'member-2', amount: 1800 },
          { userId: 'member-3', amount: 2200 }
        ]
      }
    ];

    const mockMessages: TeamMessage[] = [
      {
        id: 'msg-1',
        userId: 'member-2',
        userName: 'Sarah Johnson',
        message: 'Just added $200 to our emergency fund goal! 🎉',
        timestamp: new Date(Date.now() - 3600000),
        type: 'achievement'
      },
      {
        id: 'msg-2',
        userId: userProfile.id,
        userName: userProfile.name,
        message: 'Great work everyone! We\'re making excellent progress.',
        timestamp: new Date(Date.now() - 7200000),
        type: 'message'
      }
    ];

    setActiveTeam(mockTeam);
    setTeamMembers(mockMembers);
    setTeamGoals(mockGoals);
    setMessages(mockMessages);
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    // Mock team creation
    const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    toast.success(`Team "${newTeamName}" created! Share code: ${teamCode}`);
    setShowCreateTeam(false);
    setNewTeamName('');
    
    // In production, this would create the team in your backend
    loadTeamData();
  };

  const joinTeam = async () => {
    if (!teamCode.trim()) {
      toast.error('Please enter a team code');
      return;
    }

    // Mock team joining
    toast.success('Successfully joined the team!');
    setShowJoinTeam(false);
    setTeamCode('');
    
    // In production, this would join the team via your backend
    loadTeamData();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: TeamMessage = {
      id: Date.now().toString(),
      userId: userProfile.id,
      userName: userProfile.name,
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
  };

  const createTeamGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error('Please fill in all goal details');
      return;
    }

    const goal: TeamGoal = {
      id: Date.now().toString(),
      teamId: activeTeam.id,
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: 0,
      deadline: new Date(newGoal.deadline),
      category: newGoal.category,
      priority: 'medium',
      createdBy: userProfile.id,
      contributors: []
    };

    setTeamGoals(prev => [...prev, goal]);
    setShowCreateGoal(false);
    setNewGoal({ name: '', targetAmount: 0, deadline: '', category: 'custom' });
    
    toast.success('Team goal created successfully!');
  };

  const contributeToGoal = (goalId: string, amount: number) => {
    setTeamGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const existingContribution = goal.contributors.find(c => c.userId === userProfile.id);
        const updatedContributors = existingContribution
          ? goal.contributors.map(c => 
              c.userId === userProfile.id 
                ? { ...c, amount: c.amount + amount }
                : c
            )
          : [...goal.contributors, { userId: userProfile.id, amount }];

        return {
          ...goal,
          currentAmount: goal.currentAmount + amount,
          contributors: updatedContributors
        };
      }
      return goal;
    }));

    // Add achievement message
    const achievementMessage: TeamMessage = {
      id: Date.now().toString(),
      userId: userProfile.id,
      userName: userProfile.name,
      message: `Contributed ${formatCurrency(amount)} to team goal! 💪`,
      timestamp: new Date(),
      type: 'achievement'
    };

    setMessages(prev => [achievementMessage, ...prev]);
    toast.success(`Contributed ${formatCurrency(amount)} to team goal!`);
  };

  if (!activeTeam) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Team Saving Mode</h2>
        </div>

        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Join the Team Saving Experience</h3>
          <p className="text-gray-600 mb-6">
            Save together, achieve more! Create or join a team to share goals and motivate each other.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowCreateTeam(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Team
            </button>
            <button
              onClick={() => setShowJoinTeam(true)}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Join Team
            </button>
          </div>
        </div>

        {/* Create Team Modal */}
        {showCreateTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Team</h3>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateTeam(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            </motion.div>
          </div>
        )}

        {/* Join Team Modal */}
        {showJoinTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Join Team</h3>
              <input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                placeholder="Enter team code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinTeam(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={joinTeam}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join Team
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{activeTeam.name}</h2>
            <p className="text-gray-600">Team Code: {activeTeam.code}</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {member.avatar}
                  </div>
                  {member.role === 'leader' && (
                    <Crown className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                  {member.isOnline && (
                    <div className="w-3 h-3 bg-green-500 rounded-full absolute -bottom-1 -right-1 border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{member.name}</h4>
                  <p className="text-sm text-gray-600">
                    Contributed: {formatCurrency(member.contribution)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Goals */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Goals</h3>
          <div className="space-y-4">
            {teamGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{goal.name}</h4>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => contributeToGoal(goal.id, 50)}
                      className="flex-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      +$50
                    </button>
                    <button
                      onClick={() => contributeToGoal(goal.id, 100)}
                      className="flex-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      +$100
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Chat */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Chat</h3>
          <div className="border border-gray-200 rounded-lg h-80 flex flex-col">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-lg ${
                    message.userId === userProfile.id
                      ? 'bg-blue-100 ml-4'
                      : 'bg-gray-100 mr-4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">
                      {message.userName}
                    </span>
                    {message.type === 'achievement' && (
                      <Star className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create Team Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Goal name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={newGoal.targetAmount || ''}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) || 0 })}
                placeholder="Target amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createTeamGoal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};