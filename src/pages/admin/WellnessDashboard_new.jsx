import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp,
  TrendingDown,
  Heart,
  Brain,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Users,
  Target,
  Zap,
  Award,
  Calendar,
  Minus,
  Search,
  Filter,
  BarChart3,
  LineChart,
  Clock,
  Smile,
  Frown,
  Meh,
  ChevronRight,
  Download,
  ArrowLeft
} from 'lucide-react';

const WellnessDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeDashboards, setEmployeeDashboards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'detail'

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      setError('');
      
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch all employees
      const employeesResponse = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/admins/me/employees', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!employeesResponse.ok) {
        throw new Error(`Failed to fetch employees: ${employeesResponse.status}`);
      }

      const employeesData = await employeesResponse.json();
      const employeesList = employeesData.employees || [];
      setEmployees(employeesList);

      // Fetch dashboard data for each employee
      const dashboardPromises = employeesList.map(async (emp) => {
        try {
          const dashResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wellness/dashboard?user_id=${emp.id}`, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true'
            }
          });
          if (dashResponse.ok) {
            const dashData = await dashResponse.json();
            return { userId: emp.id, data: dashData };
          }
        } catch (err) {
          console.error(`Error fetching dashboard for user ${emp.id}:`, err);
        }
        return null;
      });

      const dashboardResults = await Promise.all(dashboardPromises);
      const dashboardsMap = {};
      dashboardResults.forEach(result => {
        if (result) {
          dashboardsMap[result.userId] = result.data;
        }
      });
      setEmployeeDashboards(dashboardsMap);
      console.log('Loaded data for', employeesList.length, 'employees');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch employee data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getRiskColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'moderate':
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-orange-400';
      case 'very_high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskBg = (category) => {
    switch (category?.toLowerCase()) {
      case 'low':
        return 'bg-green-500/20 border-green-500/50';
      case 'moderate':
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'high':
        return 'bg-orange-500/20 border-orange-500/50';
      case 'very_high':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getMoodIcon = (mood) => {
    if (mood === 'positive') return <Smile className="w-4 h-4 text-green-400" />;
    if (mood === 'negative') return <Frown className="w-4 h-4 text-red-400" />;
    return <Meh className="w-4 h-4 text-yellow-400" />;
  };

  const getStressColor = (level) => {
    if (level === 'low') return 'text-green-400 bg-green-500/20';
    if (level === 'moderate') return 'text-yellow-400 bg-yellow-500/20';
    if (level === 'high') return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthBg = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate aggregate statistics
  const aggregateStats = useMemo(() => {
    const stats = {
      totalEmployees: employees.length,
      avgWellness: 0,
      avgErgonomic: 0,
      highRiskCount: 0,
      avgPosture: 0,
      stressDistribution: { low: 0, moderate: 0, high: 0, very_high: 0 }
    };

    let wellnessSum = 0;
    let ergonomicSum = 0;
    let postureSum = 0;
    let validCount = 0;

    employees.forEach(emp => {
      const dashboard = employeeDashboards[emp.id];
      if (dashboard) {
        wellnessSum += dashboard.avg_wellness_7d || 0;
        validCount++;

        const latestTrend = dashboard.wellness_trend_7d?.[dashboard.wellness_trend_7d.length - 1];
        if (latestTrend) {
          ergonomicSum += latestTrend.ergonomic_score || 0;
          postureSum += latestTrend.good_posture_percent || 0;
          const stressLevel = latestTrend.stress_level || 'moderate';
          stats.stressDistribution[stressLevel] = (stats.stressDistribution[stressLevel] || 0) + 1;
        }

        if (dashboard.current_risk?.overall_risk_score >= 7) {
          stats.highRiskCount++;
        }
      }
    });

    stats.avgWellness = validCount > 0 ? wellnessSum / validCount : 0;
    stats.avgErgonomic = validCount > 0 ? ergonomicSum / validCount : 0;
    stats.avgPosture = validCount > 0 ? postureSum / validCount : 0;

    return stats;
  }, [employees, employeeDashboards]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep p-6 pt-32 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-forest-light animate-spin mx-auto mb-3" />
          <p className="text-gray-300">Loading wellness data...</p>
        </div>
      </div>
    );
  }

  // Detail View
  if (viewMode === 'detail' && selectedEmployee) {
    const dashboard = selectedEmployee.dashboard || {};
    const latestTrend = dashboard.wellness_trend_7d?.[dashboard.wellness_trend_7d?.length - 1];
    const currentRisk = dashboard.current_risk || {};
    const trends = dashboard.wellness_trend_7d || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep p-6 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => setViewMode('overview')}
            className="flex items-center gap-2 px-4 py-2 mb-6 bg-night-blue/50 hover:bg-night-blue 
                     text-white rounded-lg transition-colors border border-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </motion.button>

          {/* Employee Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-light to-forest-green flex items-center justify-center text-white font-bold text-2xl">
                {selectedEmployee.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{selectedEmployee.username}</h1>
                <p className="text-gray-300">{selectedEmployee.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <span className={`text-3xl font-bold ${getHealthColor(dashboard.avg_wellness_7d || 0)}`}>
                  {dashboard.avg_wellness_7d?.toFixed(0) || '--'}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Wellness Score (7d)</p>
              <div className="flex items-center gap-1 mt-2">
                {(dashboard.wellness_change_percent || 0) > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ${(dashboard.wellness_change_percent || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(dashboard.wellness_change_percent || 0).toFixed(1)}% vs 30d
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-blue-400" />
                <span className="text-3xl font-bold text-blue-400">
                  {latestTrend?.ergonomic_score?.toFixed(0) || '--'}
                </span>
              </div>
              <p className="text-gray-300 text-sm">Ergonomic Score</p>
              <p className="text-xs text-gray-400 mt-2">
                Posture: {latestTrend?.posture_quality_score?.toFixed(0) || '--'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStressColor(latestTrend?.stress_level || 'moderate')}`}>
                  {latestTrend?.stress_level?.replace('_', ' ') || 'N/A'}
                </div>
              </div>
              <p className="text-gray-300 text-sm">Stress Level</p>
              <p className="text-xs text-gray-400 mt-2">
                Fatigue: {((latestTrend?.fatigue_indicator || 0) * 100).toFixed(0)}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`backdrop-blur-sm rounded-xl p-6 border-2 ${getRiskBg(currentRisk.risk_category || 'low')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className={`w-6 h-6 ${getRiskColor(currentRisk.risk_category)}`} />
                <span className="text-3xl font-bold text-white">
                  {currentRisk.overall_risk_score || 0}/10
                </span>
              </div>
              <p className="text-gray-300 text-sm">Attrition Risk</p>
              <p className={`text-xs font-semibold mt-2 uppercase ${getRiskColor(currentRisk.risk_category)}`}>
                {currentRisk.risk_category || 'Low'} Risk
              </p>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7-Day Wellness Trend Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-400" />
                7-Day Wellness Trend
              </h3>
              <div className="space-y-3">
                {trends.slice(-7).map((trend, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-16">Day {idx + 1}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-700 rounded-full h-6 relative">
                        <motion.div 
                          className={`h-6 rounded-full bg-gradient-to-r ${getHealthBg(trend.ergonomic_score)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${trend.ergonomic_score}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {trend.ergonomic_score.toFixed(0)}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                    <div className={`w-20 text-xs px-2 py-1 rounded-full ${getStressColor(trend.stress_level)}`}>
                      {trend.stress_level.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Posture Analysis */}
            {latestTrend && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Posture Distribution
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Good Posture</span>
                      <span className="text-sm font-bold text-green-400">
                        {latestTrend.good_posture_percent?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${latestTrend.good_posture_percent}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Forward Head</span>
                      <span className="text-sm font-bold text-orange-400">
                        {latestTrend.forward_head_percent?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${latestTrend.forward_head_percent}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Slouched</span>
                      <span className="text-sm font-bold text-red-400">
                        {latestTrend.slouched_percent?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${latestTrend.slouched_percent}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>

                  {/* Pain Risk Indicators */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300 mb-3">Pain Risk Levels</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Neck</p>
                        <p className={`text-lg font-bold ${latestTrend.neck_pain_risk > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                          {(latestTrend.neck_pain_risk * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Back</p>
                        <p className={`text-lg font-bold ${latestTrend.back_pain_risk > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                          {(latestTrend.back_pain_risk * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Shoulder</p>
                        <p className={`text-lg font-bold ${latestTrend.shoulder_pain_risk > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                          {(latestTrend.shoulder_pain_risk * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity Summary */}
            {latestTrend && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  Activity Summary (Latest)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Sitting Time</p>
                    <p className="text-white text-2xl font-bold">{latestTrend.sitting_time_minutes}</p>
                    <p className="text-gray-400 text-xs">minutes</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Standing Time</p>
                    <p className="text-white text-2xl font-bold">{latestTrend.standing_time_minutes}</p>
                    <p className="text-gray-400 text-xs">minutes</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Walking Time</p>
                    <p className="text-white text-2xl font-bold">{Math.max(0, latestTrend.walking_time_minutes)}</p>
                    <p className="text-gray-400 text-xs">minutes</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-1">Breaks Taken</p>
                    <p className="text-white text-2xl font-bold">{latestTrend.break_count}</p>
                    <p className="text-gray-400 text-xs">today</p>
                  </div>
                </div>

                {/* Mood & Engagement */}
                <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    {getMoodIcon(latestTrend.mood_estimate)}
                    <div>
                      <p className="text-xs text-gray-400">Mood</p>
                      <p className="text-white capitalize">{latestTrend.mood_estimate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Engagement</p>
                      <p className="text-white capitalize">{latestTrend.engagement_level?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Risk Factors & Recommendations */}
            {currentRisk.top_risk_factors && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Risk Analysis & Actions
                </h3>
                <div>
                  <p className="text-sm text-gray-300 mb-3">Top Risk Factors:</p>
                  <div className="space-y-2 mb-4">
                    {currentRisk.top_risk_factors.map((risk, idx) => (
                      <div key={idx} className="bg-black/20 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white text-sm">{risk.factor}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            risk.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            risk.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">Value: {risk.value?.toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 mb-3">Recommended Actions:</p>
                  <div className="space-y-2">
                    {currentRisk.recommended_interventions?.map((intervention, idx) => (
                      <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-green-300 text-sm">💡 {intervention}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                    <p>Confidence: {((currentRisk.confidence || 0) * 100).toFixed(0)}%</p>
                    <p className="mt-1">Wellness Trend: {currentRisk.wellness_score_trend || 'stable'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Overview Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep p-6 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-forest-dark/50 rounded-xl">
                <BarChart3 className="w-8 h-8 text-forest-light" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Wellness Analytics Dashboard</h1>
                <p className="text-gray-300 mt-1">Real-time employee wellness monitoring</p>
              </div>
            </div>
            <button
              onClick={fetchAllData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-forest-green hover:bg-forest-dark 
                       text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees by name, email, or full name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-night-blue/50 backdrop-blur-sm rounded-xl border border-gray-700 focus:border-forest-light text-white placeholder-gray-400 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aggregate Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">{aggregateStats.totalEmployees}</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Total Employees</p>
            <p className="text-xs text-gray-400">Under monitoring</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-400" />
              <span className={`text-3xl font-bold ${getHealthColor(aggregateStats.avgWellness)}`}>
                {aggregateStats.avgWellness.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Avg Wellness Score</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${getHealthBg(aggregateStats.avgWellness)}`}
                initial={{ width: 0 }}
                animate={{ width: `${aggregateStats.avgWellness}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <span className="text-3xl font-bold text-red-400">{aggregateStats.highRiskCount}</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">High Risk Employees</p>
            <p className="text-xs text-gray-400">Requires attention</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">
                {aggregateStats.avgPosture.toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Avg Good Posture</p>
            <p className="text-xs text-gray-400">Across all employees</p>
          </motion.div>
        </div>

        {/* Stress Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Team Stress Distribution
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(aggregateStats.stressDistribution).map(([level, count]) => {
              const percentage = aggregateStats.totalEmployees > 0 
                ? (count / aggregateStats.totalEmployees) * 100 
                : 0;
              return (
                <div key={level} className="text-center">
                  <div className="mb-2">
                    <div className="h-32 bg-gray-700 rounded-lg overflow-hidden relative">
                      <motion.div
                        className={`absolute bottom-0 w-full ${
                          level === 'low' ? 'bg-gradient-to-t from-green-500 to-green-400' :
                          level === 'moderate' ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                          level === 'high' ? 'bg-gradient-to-t from-orange-500 to-orange-400' :
                          'bg-gradient-to-t from-red-500 to-red-400'
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                        {count}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm capitalize">{level.replace('_', ' ')}</p>
                  <p className="text-gray-400 text-xs">{percentage.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* No Results Message */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white text-xl mb-2">
              {searchQuery ? 'No employees match your search' : 'No employees found'}
            </p>
            <p className="text-gray-300">
              {searchQuery ? 'Try adjusting your search query' : 'Add employees to view their wellness data'}
            </p>
          </div>
        )}

        {/* Employee Cards with Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => {
            const dashboard = employeeDashboards[employee.id] || {};
            const latestTrend = dashboard.wellness_trend_7d?.[dashboard.wellness_trend_7d.length - 1];
            const avgWellness = dashboard.avg_wellness_7d || 0;
            const wellnessChange = dashboard.wellness_change_percent || 0;
            const currentRisk = dashboard.current_risk || {};
            const trends = dashboard.wellness_trend_7d || [];
            
            return (
              <motion.div
                key={employee.id}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-forest-light transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => {
                  setSelectedEmployee({ ...employee, dashboard });
                  setViewMode('detail');
                }}
              >
                {/* Employee Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-light to-forest-green flex items-center justify-center text-white font-bold text-lg">
                      {employee.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{employee.username}</h3>
                      <p className="text-gray-400 text-xs">{employee.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                {/* Wellness Score with Trend */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Wellness (7d avg)
                    </span>
                    <div className="flex items-center gap-2">
                      {wellnessChange !== 0 && (
                        <span className={`text-xs flex items-center gap-1 ${wellnessChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {wellnessChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(wellnessChange).toFixed(1)}%
                        </span>
                      )}
                      <span className={`text-2xl font-bold ${getHealthColor(avgWellness)}`}>
                        {avgWellness.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getHealthBg(avgWellness)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${avgWellness}%` }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                    />
                  </div>
                </div>

                {/* 7-Day Trend Mini Chart */}
                {trends.length > 0 && (
                  <div className="mb-4 p-3 bg-black/20 rounded-lg">
                    <p className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                      <LineChart className="w-3 h-3" />
                      7-Day Trend
                    </p>
                    <div className="flex items-end justify-between gap-1 h-16">
                      {trends.slice(-7).map((trend, idx) => {
                        const height = (trend.ergonomic_score / 100) * 100;
                        return (
                          <motion.div
                            key={idx}
                            className="flex-1 relative group"
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 + idx * 0.05 }}
                          >
                            <div 
                              className={`w-full rounded-t bg-gradient-to-t ${getHealthBg(trend.ergonomic_score)} h-full`}
                              title={`Day ${idx + 1}: ${trend.ergonomic_score.toFixed(0)}`}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <Activity className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400 mb-1">Ergonomic</p>
                    <p className="text-white font-bold text-sm">
                      {latestTrend?.ergonomic_score?.toFixed(0) || '--'}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <Brain className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400 mb-1">Stress</p>
                    <p className={`text-xs font-semibold px-1 py-0.5 rounded ${getStressColor(latestTrend?.stress_level || 'moderate')}`}>
                      {latestTrend?.stress_level?.split('_')[0] || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <div className="mx-auto mb-1">{getMoodIcon(latestTrend?.mood_estimate)}</div>
                    <p className="text-xs text-gray-400 mb-1">Mood</p>
                    <p className="text-white text-sm capitalize">
                      {latestTrend?.mood_estimate?.slice(0, 3) || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Posture Progress Bar */}
                {latestTrend && (
                  <div className="mb-3">
                    <p className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Posture Quality: {latestTrend.good_posture_percent?.toFixed(0)}%
                    </p>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500"
                        style={{ width: `${latestTrend.good_posture_percent || 0}%` }}
                        title="Good Posture"
                      />
                      <div 
                        className="bg-orange-500"
                        style={{ width: `${latestTrend.forward_head_percent || 0}%` }}
                        title="Forward Head"
                      />
                      <div 
                        className="bg-red-500"
                        style={{ width: `${latestTrend.slouched_percent || 0}%` }}
                        title="Slouched"
                      />
                    </div>
                  </div>
                )}

                {/* Risk Badge & Activity */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  {currentRisk.risk_category && (
                    <div className={`text-xs px-3 py-1 rounded-full border ${getRiskBg(currentRisk.risk_category)}`}>
                      Risk: {currentRisk.risk_category.toUpperCase()}
                    </div>
                  )}
                  {latestTrend && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {latestTrend.break_count || 0} breaks
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WellnessDashboard;
