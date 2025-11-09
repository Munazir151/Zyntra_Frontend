import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertCircle, 
  CheckCircle,
  Lightbulb,
  RefreshCw,
  Target,
  Calendar,
  Award,
  Activity,
  Heart,
  Zap,
  ArrowRight,
  Eye,
  Clock
} from 'lucide-react';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedInsight, setExpandedInsight] = useState(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wellness/ai-insights`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch insights: ${response.status}`);
      }

      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError(err.message || 'Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getTrendColor = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'improving':
        return 'text-green-400 bg-green-500/20';
      case 'stable':
        return 'text-blue-400 bg-blue-500/20';
      case 'declining':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'improving':
        return <TrendingUp className="w-5 h-5" />;
      case 'stable':
        return <CheckCircle className="w-5 h-5" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-600';
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getInsightCategory = (index) => {
    const categories = [
      { 
        icon: Activity, 
        label: 'Posture',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-400',
        borderHover: 'hover:border-blue-400/40',
        arrowColor: 'text-blue-400'
      },
      { 
        icon: Heart, 
        label: 'Ergonomics',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
        badgeBg: 'bg-green-500/20',
        badgeText: 'text-green-400',
        borderHover: 'hover:border-green-400/40',
        arrowColor: 'text-green-400'
      },
      { 
        icon: Brain, 
        label: 'Stress',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-400',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-400',
        borderHover: 'hover:border-purple-400/40',
        arrowColor: 'text-purple-400'
      },
      { 
        icon: Zap, 
        label: 'Engagement',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400',
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-yellow-400',
        borderHover: 'hover:border-yellow-400/40',
        arrowColor: 'text-yellow-400'
      },
      { 
        icon: Activity, 
        label: 'Activity',
        iconBg: 'bg-pink-500/20',
        iconColor: 'text-pink-400',
        badgeBg: 'bg-pink-500/20',
        badgeText: 'text-pink-400',
        borderHover: 'hover:border-pink-400/40',
        arrowColor: 'text-pink-400'
      },
      { 
        icon: AlertCircle, 
        label: 'Pain Risk',
        iconBg: 'bg-orange-500/20',
        iconColor: 'text-orange-400',
        badgeBg: 'bg-orange-500/20',
        badgeText: 'text-orange-400',
        borderHover: 'hover:border-orange-400/40',
        arrowColor: 'text-orange-400'
      },
      { 
        icon: Clock, 
        label: 'Movement',
        iconBg: 'bg-indigo-500/20',
        iconColor: 'text-indigo-400',
        badgeBg: 'bg-indigo-500/20',
        badgeText: 'text-indigo-400',
        borderHover: 'hover:border-indigo-400/40',
        arrowColor: 'text-indigo-400'
      },
      { 
        icon: Award, 
        label: 'Progress',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
        badgeBg: 'bg-green-500/20',
        badgeText: 'text-green-400',
        borderHover: 'hover:border-green-400/40',
        arrowColor: 'text-green-400'
      }
    ];
    return categories[index % categories.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Brain className="w-16 h-16 text-purple-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Wellness Data</h2>
            <p className="text-gray-300">AI is generating personalized insights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Insights</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={fetchInsights}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep pt-32 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                    '0 0 40px rgba(168, 85, 247, 0.6)',
                    '0 0 20px rgba(168, 85, 247, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">AI Wellness Insights</h1>
                <p className="text-gray-300">Personalized recommendations powered by advanced analytics</p>
              </div>
            </div>
            <button
              onClick={fetchInsights}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm border border-white/10"
              title="Refresh insights"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* User Info */}
          {insights && (
            <div className="bg-night-blue/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-forest-light to-forest-green rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {insights.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{insights.username}</h2>
                    <p className="text-gray-400">User ID: {insights.user_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Last Generated</p>
                  <p className="text-white font-semibold">
                    {new Date(insights.generated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Wellness Summary Cards */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Average Wellness Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-night-blue/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Wellness Score</p>
                  <p className={`text-3xl font-bold ${getScoreTextColor(insights.avg_wellness_score)}`}>
                    {insights.avg_wellness_score.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(insights.avg_wellness_score)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.avg_wellness_score}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Wellness Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-night-blue/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${getTrendColor(insights.wellness_trend)}`}>
                  {getTrendIcon(insights.wellness_trend)}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Trend Status</p>
                  <p className="text-2xl font-bold text-white capitalize">{insights.wellness_trend}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {insights.wellness_trend === 'improving' && '📈 Your wellness is getting better!'}
                {insights.wellness_trend === 'stable' && '➡️ Maintaining consistent wellness'}
                {insights.wellness_trend === 'declining' && '📉 Needs attention and improvement'}
              </p>
            </motion.div>

            {/* Analysis Period */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-night-blue/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Analysis Period</p>
                  <p className="text-3xl font-bold text-white">{insights.data_period_days}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Days of wellness data analyzed</p>
            </motion.div>
          </div>
        )}

        {/* AI Insights Cards */}
        {insights?.insights && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Your Personalized Insights</h3>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                {insights.insights.length} Recommendations
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.insights.map((insight, index) => {
                const category = getInsightCategory(index);
                const Icon = category.icon;
                const isExpanded = expandedInsight === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`bg-gradient-to-br from-night-blue/80 to-night-deep/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${category.borderHover} transition-all cursor-pointer`}
                    onClick={() => setExpandedInsight(isExpanded ? null : index)}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex gap-4">
                      {/* Category Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 ${category.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${category.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-1 ${category.badgeBg} ${category.badgeText} rounded-full`}>
                              {category.label}
                            </span>
                            <span className="text-xs text-gray-400">Insight #{index + 1}</span>
                          </div>
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                        </div>

                        <p className="text-gray-200 leading-relaxed text-sm">
                          {insight}
                        </p>

                        {/* Action Indicator */}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Click to {isExpanded ? 'collapse' : 'expand'}</span>
                          <ArrowRight className={`w-4 h-4 ${category.arrowColor} transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-gray-300">Actionable recommendation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Eye className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-300">Based on {insights.data_period_days} days of data</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-300">AI-powered analysis</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-night-blue/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
            <p className="text-gray-400 text-sm">
              💡 These insights are generated by AI based on your wellness patterns and behaviors.
              <br />
              Follow these recommendations to improve your overall well-being.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIInsights;
