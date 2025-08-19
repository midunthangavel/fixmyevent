'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { 
  Trophy, 
    Star,
  Gift,
  TrendingUp, 
  Award,
  Zap,
  Heart,
  MessageCircle,
  Calendar,
  Users,
  DollarSign,
  Crown,
  CheckCircle
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'booking' | 'review' | 'social' | 'loyalty' | 'special';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  pointsCost: number;
  isRedeemed: boolean;
  redeemedAt?: Date;
  category: 'discount' | 'feature' | 'badge' | 'special';
}

interface UserStats {
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  totalBookings: number;
  totalReviews: number;
  totalReferrals: number;
  streakDays: number;
  lastActivity: Date;
}

interface RewardsSystemProps {
  className?: string;
}

export function RewardsSystem({ className = "" }: RewardsSystemProps) {
  const [userStats, setUserStats] = useLocalStorage<UserStats>('user-stats', {
    totalPoints: 1250,
    level: 3,
    currentLevelPoints: 250,
    nextLevelPoints: 500,
    totalBookings: 8,
    totalReviews: 12,
    totalReferrals: 3,
    streakDays: 15,
    lastActivity: new Date()
  });

  const [achievements] = useLocalStorage<Achievement[]>('user-achievements', [
    {
      id: 'first-booking',
      name: 'First Booking',
      description: 'Complete your first event booking',
      icon: <Calendar className="h-5 w-5" />,
      category: 'booking',
      points: 100,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'reviewer',
      name: 'Active Reviewer',
      description: 'Write 10 reviews for venues and services',
      icon: <Star className="h-5 w-5" />,
      category: 'review',
      points: 200,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      progress: 12,
      maxProgress: 10
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Share 5 events on social media',
      icon: <MessageCircle className="h-5 w-5" />,
      category: 'social',
      points: 150,
      isUnlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: 'loyal-customer',
      name: 'Loyal Customer',
      description: 'Book 20 events',
      icon: <Heart className="h-5 w-5" />,
      category: 'loyalty',
      points: 500,
      isUnlocked: false,
      progress: 8,
      maxProgress: 20
    },
    {
      id: 'referral-master',
      name: 'Referral Master',
      description: 'Refer 10 friends to FixMyEvent',
      icon: <Users className="h-5 w-5" />,
      category: 'social',
      points: 300,
      isUnlocked: false,
      progress: 3,
      maxProgress: 10
    },
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Join FixMyEvent during beta phase',
      icon: <Zap className="h-5 w-5" />,
      category: 'special',
      points: 1000,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      progress: 1,
      maxProgress: 1
    }
  ]);

  const [rewards, setRewards] = useLocalStorage<Reward[]>('available-rewards', [
    {
      id: 'discount-10',
      name: '10% Off Next Booking',
      description: 'Get 10% off your next event booking',
      icon: <DollarSign className="h-5 w-5" />,
      pointsCost: 500,
      isRedeemed: false,
      category: 'discount'
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: 'Get priority customer support for 30 days',
      icon: <MessageCircle className="h-5 w-5" />,
      pointsCost: 300,
      isRedeemed: false,
      category: 'feature'
    },
    {
      id: 'exclusive-badge',
      name: 'VIP Badge',
      description: 'Show off your VIP status with an exclusive badge',
      icon: <Crown className="h-5 w-5" />,
      pointsCost: 1000,
      isRedeemed: false,
      category: 'badge'
    },
    {
      id: 'free-upgrade',
      name: 'Free Service Upgrade',
      description: 'Upgrade one service for free on your next booking',
      icon: <TrendingUp className="h-5 w-5" />,
      pointsCost: 750,
      isRedeemed: false,
      category: 'special'
    }
  ]);

  const [showRedeemed, setShowRedeemed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const levelProgress = ((userStats.currentLevelPoints / userStats.nextLevelPoints) * 100);
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Legendary';
    if (level >= 7) return 'Master';
    if (level >= 5) return 'Expert';
    if (level >= 3) return 'Advanced';
    if (level >= 1) return 'Beginner';
    return 'Newcomer';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking': return <Calendar className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'social': return <MessageCircle className="h-4 w-4" />;
      case 'loyalty': return <Heart className="h-4 w-4" />;
      case 'special': return <Zap className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'social': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'loyalty': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'special': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && userStats.totalPoints >= reward.pointsCost) {
      setRewards(prev => prev.map(r => 
        r.id === rewardId 
          ? { ...r, isRedeemed: true, redeemedAt: new Date() }
          : r
      ));
      
      setUserStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints - reward.pointsCost
      }));
    }
  };

  const filteredRewards = rewards.filter(reward => {
    if (selectedCategory !== 'all' && reward.category !== selectedCategory) return false;
    if (!showRedeemed && reward.isRedeemed) return false;
    return true;
  });

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Level & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Level {userStats.level} - {getLevelTitle(userStats.level)}
          </CardTitle>
          <CardDescription>Your progress and achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{userStats.currentLevelPoints} / {userStats.nextLevelPoints} XP</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="w-full" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {userStats.nextLevelPoints - userStats.currentLevelPoints} XP to next level
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.totalBookings}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{userStats.totalReviews}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.streakDays}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements ({unlockedAchievements}/{totalAchievements})
          </CardTitle>
          <CardDescription>Unlock achievements to earn points and badges</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Badge>
            {['booking', 'review', 'social', 'loyalty', 'special'].map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)}
                <span className="ml-1 capitalize">{category}</span>
              </Badge>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.isUnlocked
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.isUnlocked 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <Badge variant="secondary" className={getCategoryColor(achievement.category)}>
                        {achievement.points} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    
                    {achievement.isUnlocked ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Unlocked {achievement.unlockedAt?.toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Rewards
          </CardTitle>
          <CardDescription>Redeem your points for exclusive rewards</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Toggle */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-redeemed"
                checked={showRedeemed}
                onCheckedChange={setShowRedeemed}
              />
              <Label htmlFor="show-redeemed">Show Redeemed</Label>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Badge>
              {['discount', 'feature', 'badge', 'special'].map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="capitalize">{category}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  reward.isRedeemed
                    ? 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    reward.isRedeemed
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  }`}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{reward.name}</h4>
                      <Badge variant="secondary">
                        {reward.pointsCost} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {reward.description}
                    </p>
                    
                    {reward.isRedeemed ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Redeemed {reward.redeemedAt?.toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {userStats.totalPoints >= reward.pointsCost 
                            ? 'Available to redeem' 
                            : `${reward.pointsCost - userStats.totalPoints} more XP needed`
                          }
                        </span>
                        <Button
                          size="sm"
                          onClick={() => redeemReward(reward.id)}
                          disabled={userStats.totalPoints < reward.pointsCost}
                        >
                          Redeem
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
