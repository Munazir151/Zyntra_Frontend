import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Flame,
  Coffee,
  Droplets,
  Sparkles,
  Focus,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Zap
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WorkplaceDashboard = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  // Stats data
  const stats = [
    {
      id: 1,
      icon: Users,
      label: 'Engagement Index',
      value: '87%',
      trend: 'up',
      change: '+5%',
      color: 'text-green-400'
    },
    {
      id: 2,
      icon: Activity,
      label: 'Posture Score',
      value: '92',
      trend: 'up',
      change: '+3',
      color: 'text-blue-400'
    },
    {
      id: 3,
      icon: Clock,
      label: 'Focus Hours',
      value: '6.5h',
      trend: 'up',
      change: '+0.5h',
      color: 'text-purple-400'
    },
    {
      id: 4,
      icon: AlertCircle,
      label: 'Fatigue Level',
      value: 'Low',
      trend: 'down',
      change: '-12%',
      color: 'text-yellow-400'
    },
    {
      id: 5,
      icon: Calendar,
      label: 'Attendance Rate',
      value: '96%',
      trend: 'neutral',
      change: '0%',
      color: 'text-cyan-400'
    },
    {
      id: 6,
      icon: Flame,
      label: 'Wellness Streak',
      value: '14 days',
      trend: 'up',
      change: '+1',
      color: 'text-orange-400'
    }
  ];

  // Quick actions data
  const quickActions = [
    { id: 1, icon: Coffee, label: 'Take Break', color: 'from-amber-500 to-orange-500' },
    { id: 2, icon: Droplets, label: 'Hydrate', color: 'from-blue-500 to-cyan-500' },
    { id: 3, icon: Sparkles, label: 'Stretch', color: 'from-purple-500 to-pink-500' },
    { id: 4, icon: Focus, label: 'Focus Mode', color: 'from-green-500 to-emerald-500' }
  ];

  // AI Insights data
  const aiInsights = [
    {
      id: 1,
      icon: Brain,
      message: 'Your posture has improved by 15% this week! Keep up the good work with regular stretching breaks.',
      type: 'positive'
    },
    {
      id: 2,
      icon: Zap,
      message: 'Consider taking a short break. You\'ve been focused for 2.5 hours straight. A 5-minute walk can boost productivity.',
      type: 'suggestion'
    }
  ];

  // Attendance Chart Data
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance Rate',
        data: [95, 98, 92, 100, 94, 88, 90],
        backgroundColor: 'rgba(74, 222, 128, 0.8)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Weekly Attendance',
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        bodyFont: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          callback: (value) => value + '%'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  // Posture Trend Chart Data
  const postureTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Posture Score',
        data: [75, 82, 88, 92],
        borderColor: 'rgba(96, 165, 250, 1)',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(96, 165, 250, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8
      }
    ]
  };

  const postureTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Posture Improvement Trend',
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        bodyFont: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen h-full overflow-y-auto bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 pt-28 md:pt-32 p-4 md:p-8 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Workplace Wellness Overview
          </h1>
          <p className="text-forest-light text-lg">
            Your comprehensive health and productivity insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-forest-400/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(stat.trend)}
                  <span className={
                    stat.trend === 'up' ? 'text-green-400' : 
                    stat.trend === 'down' ? 'text-red-400' : 
                    'text-gray-400'
                  }>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-forest-light text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-light text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Attendance Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="h-[300px]">
              <Bar data={attendanceData} options={attendanceOptions} />
            </div>
          </div>

          {/* Posture Trend Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="h-[300px]">
              <Line data={postureTrendData} options={postureTrendOptions} />
            </div>
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">AI Wellness Insights</h2>
          </div>
          
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <motion.div
                key={insight.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl ${
                  insight.type === 'positive' 
                    ? 'bg-green-500/20 border border-green-400/30' 
                    : 'bg-blue-500/20 border border-blue-400/30'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'positive' 
                      ? 'bg-green-500/30' 
                      : 'bg-blue-500/30'
                  }`}>
                    <insight.icon className={`w-5 h-5 ${
                      insight.type === 'positive' 
                        ? 'text-green-300' 
                        : 'text-blue-300'
                    }`} />
                  </div>
                  <p className="text-white text-sm leading-relaxed flex-1">
                    {insight.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${action.color} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-all">
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {action.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-forest-light text-sm"
        >
          <p>Last updated: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WorkplaceDashboard;
