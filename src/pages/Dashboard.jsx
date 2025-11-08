import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TreePine, Flame, Activity, Clock, Heart, TrendingUp,
  Target, Zap, Calendar, Award, Footprints, Brain,
  Coffee, Moon, Sun, Droplets
} from 'lucide-react';
import useStore from '../store/useStore';

const StatCard = ({ icon: Icon, label, value, color, trend, subtitle }) => {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500 bg-opacity-20`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-light text-white mb-1">{value}</h3>
      <p className="text-forest-light text-sm">{label}</p>
      {subtitle && (
        <p className="text-forest-light text-xs mt-2 opacity-70">{subtitle}</p>
      )}
    </motion.div>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick, color = "forest" }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-${color} bg-opacity-10 hover:bg-opacity-20 transition-all`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={`text-${color}-light`} size={28} />
      <span className="text-white text-sm">{label}</span>
    </motion.button>
  );
};

const ActivityItem = ({ activity, index }) => {
  const icons = {
    exercise: Footprints,
    meditation: Brain,
    work: Coffee,
    sleep: Moon,
    walk: Footprints,
    eco: TreePine,
    phone: Activity
  };
  const Icon = icons[activity.type] || Activity;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-forest bg-opacity-20">
          <Icon className="text-forest-light" size={20} />
        </div>
        <div>
          <p className="text-white font-medium">{activity.description}</p>
          <p className="text-forest-light text-sm">
            {new Date(activity.timestamp).toLocaleDateString()} · {activity.duration || 0} min
          </p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        activity.ecoImpact > 0 ? 'bg-forest bg-opacity-20 text-forest-light' : 
        'bg-red-500 bg-opacity-20 text-red-300'
      }`}>
        {activity.ecoImpact > 0 ? '+' : ''}{activity.ecoImpact}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { ecoScore, activities, forestHealth, badges } = useStore();
  
  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const positiveActivities = activities.filter(a => a.ecoImpact > 0);
    const totalPositiveImpact = positiveActivities.reduce((sum, a) => sum + a.ecoImpact, 0);
    
    const workActivities = activities.filter(a => a.type === 'work');
    const wellnessActivities = activities.filter(a => 
      a.type === 'exercise' || a.type === 'meditation' || a.type === 'walk'
    );
    
    const currentWeekActivities = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate > weekAgo;
    });
    
    const prevWeekActivities = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate > twoWeeksAgo && activityDate <= weekAgo;
    });
    
    const activityTrend = prevWeekActivities.length > 0
      ? Math.round(((currentWeekActivities.length - prevWeekActivities.length) / prevWeekActivities.length) * 100)
      : 0;
    
    // Calculate total hours
    const totalMinutes = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
    const totalHours = Math.round(totalMinutes / 60);
    
    // Calculate streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const hasActivityToday = activities.some(a => new Date(a.timestamp).toDateString() === today);
    const hasActivityYesterday = activities.some(a => new Date(a.timestamp).toDateString() === yesterday);
    
    let currentStreak = 0;
    if (hasActivityToday || hasActivityYesterday) {
      const sortedDates = [...new Set(activities.map(a => new Date(a.timestamp).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
      for (let i = 0; i < sortedDates.length; i++) {
        const expected = new Date(Date.now() - i * 86400000).toDateString();
        if (sortedDates[i] === expected) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    return {
      energySaved: totalPositiveImpact,
      focusStreak: workActivities.length,
      wellnessBalance: wellnessActivities.length,
      weeklyActivities: currentWeekActivities.length,
      activityTrend,
      totalHours,
      currentStreak,
      totalActivities: activities.length,
      avgDailyActivities: activities.length > 0 ? Math.round(activities.length / 7) : 0
    };
  }, [activities]);
  
  const recentActivities = activities.slice(-5).reverse();
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-night-blue to-night-deep">
      <div className="h-full overflow-y-auto pt-32 md:pt-36 pb-8 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-light text-white mb-2">Dashboard</h1>
            <p className="text-forest-light">Your complete overview</p>
          </motion.div>
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              icon={TreePine}
              label="Eco Score"
              value={ecoScore}
              color="forest"
            />
            <StatCard
              icon={Flame}
              label="Day Streak"
              value={stats.currentStreak}
              color="orange"
              subtitle="consecutive days"
            />
            <StatCard
              icon={Activity}
              label="Activities"
              value={stats.totalActivities}
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Hours"
              value={stats.totalHours}
              color="purple"
              subtitle="total logged"
            />
            <StatCard
              icon={Heart}
              label="Wellness"
              value={stats.wellnessBalance}
              color="red"
            />
            <StatCard
              icon={TrendingUp}
              label="This Week"
              value={stats.weeklyActivities}
              color="green"
              trend={stats.activityTrend}
            />
          </div>
          
          {/* Forest Health Overview */}
          <motion.div
            className="glass-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-1">Forest Health</h2>
                <p className="text-forest-light text-sm">Your digital ecosystem status</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-light text-sunlight-yellow mb-1">
                  {Math.round(forestHealth * 100)}%
                </p>
                <p className="text-forest-light text-sm">Health Score</p>
              </div>
            </div>
            
            {/* Health Bar */}
            <div className="w-full h-4 bg-white bg-opacity-10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: forestHealth > 0.7 ? 
                    'linear-gradient(to right, #00A878, #A7E8BD)' :
                    forestHealth > 0.4 ?
                    'linear-gradient(to right, #FFA726, #FFE156)' :
                    'linear-gradient(to right, #FF6B6B, #FFA726)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${forestHealth * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            {/* Health Description */}
            <p className="text-forest-light text-sm mt-4 text-center">
              {forestHealth > 0.8 ? '🌟 Your forest is thriving! Keep up the excellent work!' :
               forestHealth > 0.6 ? '🌿 Great progress! Your forest is growing strong.' :
               forestHealth > 0.4 ? '🌤️ Your forest needs some attention. Add more positive activities.' :
               '🌧️ Time to restore balance. Focus on wellness and eco-friendly habits.'}
            </p>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            className="glass-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-light text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              <QuickActionButton icon={TreePine} label="Log Activity" color="forest" />
              <QuickActionButton icon={Brain} label="Meditate" color="purple" />
              <QuickActionButton icon={Footprints} label="Exercise" color="blue" />
              <QuickActionButton icon={Droplets} label="Hydrate" color="cyan" />
            </div>
          </motion.div>
          
          {/* Recent Activities */}
          <motion.div
            className="glass-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-forest" size={24} />
              <div>
                <h2 className="text-xl font-light text-white mb-1">Recent Activities</h2>
                <p className="text-forest-light text-sm">Last 5 logged</p>
              </div>
            </div>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, idx) => (
                  <ActivityItem key={idx} activity={activity} index={idx} />
                ))
              ) : (
                <div className="text-center py-8 text-forest-light">
                  No activities yet. Start logging to see your progress!
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Achievements */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-sunlight-yellow" size={28} />
              <div>
                <h2 className="text-2xl font-light text-white">Achievements</h2>
                <p className="text-forest-light text-sm">
                  {badges.length} badge{badges.length !== 1 ? 's' : ''} earned
                </p>
              </div>
            </div>
            
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className="glass-card p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-2">{badge.name.split(' ')[1]}</div>
                    <h4 className="text-white text-sm font-medium mb-1">
                      {badge.name.split(' ')[0]}
                    </h4>
                    <p className="text-forest-light text-xs">{badge.description}</p>
                    <p className="text-sunlight-yellow text-xs mt-2">
                      {new Date(badge.earned).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-white text-lg font-light mb-2">No badges yet</p>
                <p className="text-forest-light">
                  Keep logging activities to earn your first achievement!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
