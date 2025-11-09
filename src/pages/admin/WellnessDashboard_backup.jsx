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
  Download
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
      avgErgonom ic: 0,
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

  // Overview Mode
  if (viewMode === 'overview') {
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
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">7-Day Avg Wellness</p>
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-3xl font-bold text-white">{dashboardData.avg_wellness_7d?.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {dashboardData.wellness_change_percent > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : dashboardData.wellness_change_percent < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${dashboardData.wellness_change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(dashboardData.wellness_change_percent).toFixed(1)}% vs 30d
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">30-Day Avg Wellness</p>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{dashboardData.avg_wellness_30d?.toFixed(1)}%</p>
                <p className="text-sm text-gray-400 mt-1">Long-term trend</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Posture Trend</p>
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(dashboardData.posture_quality_trend)}
                  <p className="text-2xl font-bold text-white capitalize">
                    {dashboardData.posture_quality_trend || 'Stable'}
                  </p>
                </div>
                <p className="text-sm text-gray-400 mt-1">Quality assessment</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`backdrop-blur-sm rounded-xl p-4 border ${getRiskBg(dashboardData.current_risk?.risk_category)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Risk Level</p>
                  <AlertTriangle className={`w-5 h-5 ${getRiskColor(dashboardData.current_risk?.risk_category)}`} />
                </div>
                <p className={`text-3xl font-bold capitalize ${getRiskColor(dashboardData.current_risk?.risk_category)}`}>
                  {dashboardData.current_risk?.risk_category || 'Unknown'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Score: {dashboardData.current_risk?.overall_risk_score || 'N/A'}
                </p>
              </motion.div>
            </div>

            {/* Current Risk Details */}
            {dashboardData.current_risk && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">Risk Assessment</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Wellness Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(dashboardData.current_risk.wellness_score_trend)}
                      <p className="text-white font-medium capitalize">
                        {dashboardData.current_risk.wellness_score_trend}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Stress Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(dashboardData.current_risk.stress_trend)}
                      <p className="text-white font-medium capitalize">
                        {dashboardData.current_risk.stress_trend}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Engagement Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(dashboardData.current_risk.engagement_trend)}
                      <p className="text-white font-medium capitalize">
                        {dashboardData.current_risk.engagement_trend}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {dashboardData.current_risk.top_risk_factors?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-white font-medium mb-3">Top Risk Factors</h3>
                    <div className="space-y-2">
                      {dashboardData.current_risk.top_risk_factors.map((factor, index) => (
                        <div key={index} className="bg-black/20 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${getRiskColor(factor.severity)}`} />
                            <span className="text-white">{factor.factor}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm capitalize ${getRiskColor(factor.severity)}`}>
                              {factor.severity}
                            </span>
                            <span className="text-white font-medium">{factor.value?.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {dashboardData.current_risk.recommended_interventions?.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Recommended Actions</h3>
                    <div className="space-y-2">
                      {dashboardData.current_risk.recommended_interventions.map((intervention, index) => (
                        <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-200">{intervention}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 7-Day Wellness Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">7-Day Wellness Trend</h2>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dashboardData.wellness_trend_7d?.map((day, index) => (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="bg-black/20 rounded-lg p-4 hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-medium">{formatDate(day.date)}</p>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Ergonomic</p>
                          <p className="text-white font-bold">{day.ergonomic_score}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Posture</p>
                          <p className="text-white font-bold">{day.posture_quality_score?.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Good Posture</p>
                        <p className="text-green-400 font-medium">{day.good_posture_percent?.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Poor Posture</p>
                        <p className="text-red-400 font-medium">{day.poor_posture_percent?.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Stress Level</p>
                        <p className={`font-medium capitalize ${getRiskColor(day.stress_level)}`}>
                          {day.stress_level}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Mood</p>
                        <p className="text-white font-medium capitalize">{day.mood_estimate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-700 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">Sitting</p>
                        <p className="text-white">{day.sitting_time_minutes}m</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Standing</p>
                        <p className="text-white">{day.standing_time_minutes}m</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Breaks</p>
                        <p className="text-white">{day.break_count}</p>
                      </div>
                    </div>

                    {/* Pain Risks */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${day.neck_pain_risk > 0.3 ? 'text-red-400' : 'text-green-400'}`} />
                        <span className="text-xs text-gray-400">Neck: </span>
                        <span className="text-xs text-white">{(day.neck_pain_risk * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${day.back_pain_risk > 0.3 ? 'text-red-400' : 'text-green-400'}`} />
                        <span className="text-xs text-gray-400">Back: </span>
                        <span className="text-xs text-white">{(day.back_pain_risk * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className={`w-3 h-3 ${day.shoulder_pain_risk > 0.3 ? 'text-red-400' : 'text-green-400'}`} />
                        <span className="text-xs text-gray-400">Shoulder: </span>
                        <span className="text-xs text-white">{(day.shoulder_pain_risk * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Today's Stats */}
            {(dashboardData.today_ergonomic_score || dashboardData.today_stress_level || dashboardData.today_mood) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold text-white">Today's Performance</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.today_ergonomic_score && (
                    <div className="bg-black/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-2">Ergonomic Score</p>
                      <p className="text-3xl font-bold text-white">{dashboardData.today_ergonomic_score}%</p>
                    </div>
                  )}
                  {dashboardData.today_stress_level && (
                    <div className="bg-black/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-2">Stress Level</p>
                      <p className={`text-3xl font-bold capitalize ${getRiskColor(dashboardData.today_stress_level)}`}>
                        {dashboardData.today_stress_level}
                      </p>
                    </div>
                  )}
                  {dashboardData.today_mood && (
                    <div className="bg-black/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-2">Mood</p>
                      <p className="text-3xl font-bold text-white capitalize">{dashboardData.today_mood}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessDashboard;
