import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trees, 
  Heart,
  Sun,
  Droplets,
  Wind,
  Sprout,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Cloud,
  CloudRain,
  Flower2,
  Bird,
  Bug,
  Waves,
  Award,
  AlertCircle,
  Minus
} from 'lucide-react';

const WellnessForest = () => {
  const [forestData, setForestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchForest = async () => {
    try {
      setRefreshing(true);
      setError('');
      
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wellness/forest`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch forest: ${response.status}`);
      }

      const data = await response.json();
      setForestData(data);
      console.log('Forest data:', data);
    } catch (err) {
      console.error('Error fetching forest:', err);
      setError(err.message || 'Failed to fetch forest');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForest();
  }, []);

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthBg = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getSeasonEmoji = (season) => {
    switch (season) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌿';
    }
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'clear': return <Sun className="w-5 h-5 text-yellow-300" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendIcon = (rate) => {
    if (rate > 0) return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (rate < 0) return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep p-6 pt-32 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-forest-light animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep p-6 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-forest-dark/50 rounded-xl">
                <Trees className="w-8 h-8 text-forest-light" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Wellness Forest</h1>
                <p className="text-gray-300 mt-1">Your health journey visualized</p>
              </div>
            </div>
            <button
              onClick={fetchForest}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-forest-green hover:bg-forest-dark 
                       text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {forestData && (
          <div className="space-y-6">
            {/* Forest Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-sm rounded-xl p-6 border ${getHealthBg(forestData.forest_health_score)}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {getSeasonEmoji(forestData.season)} {forestData.season?.charAt(0).toUpperCase() + forestData.season?.slice(1)} Forest
                  </h2>
                  <p className="text-gray-300 capitalize">
                    {forestData.time_of_day} • {forestData.weather}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getWeatherIcon(forestData.weather)}
                  {getTrendIcon(forestData.growth_rate)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getHealthColor(forestData.forest_health_score)}`}>
                    {forestData.forest_health_score?.toFixed(1)}%
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Forest Health</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{forestData.total_trees}</p>
                  <p className="text-gray-400 text-sm mt-1">Total Trees</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-400">{forestData.biodiversity_score?.toFixed(0)}%</p>
                  <p className="text-gray-400 text-sm mt-1">Biodiversity</p>
                </div>
                <div className="text-center">
                  <p className={`text-4xl font-bold ${forestData.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {forestData.growth_rate > 0 ? '+' : ''}{forestData.growth_rate?.toFixed(1)}%
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Growth Rate</p>
                </div>
              </div>
            </motion.div>

            {/* Tree Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Trees className="w-5 h-5 text-forest-light" />
                Tree Distribution
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🌳</span>
                    <span className="text-2xl font-bold text-green-400">{forestData.healthy_trees}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Healthy Trees</p>
                  <p className="text-green-400 text-xs mt-1">
                    {((forestData.healthy_trees / forestData.total_trees) * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🌱</span>
                    <span className="text-2xl font-bold text-yellow-400">{forestData.growing_trees}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Growing Trees</p>
                  <p className="text-yellow-400 text-xs mt-1">
                    {((forestData.growing_trees / forestData.total_trees) * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🍂</span>
                    <span className="text-2xl font-bold text-orange-400">{forestData.wilting_trees}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Wilting Trees</p>
                  <p className="text-orange-400 text-xs mt-1">
                    {((forestData.wilting_trees / forestData.total_trees) * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-gray-500/20 border border-gray-500/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🪵</span>
                    <span className="text-2xl font-bold text-gray-400">{forestData.dead_trees}</span>
                  </div>
                  <p className="text-gray-300 text-sm">Dead Trees</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {((forestData.dead_trees / forestData.total_trees) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Environmental Factors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-forest-light" />
                Environmental Factors
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Sunlight Level</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${forestData.sunlight_level}%` }}
                      />
                    </div>
                    <span className="text-white font-bold">{forestData.sunlight_level}%</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Mood & Engagement</p>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Water Level</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${forestData.water_level}%` }}
                      />
                    </div>
                    <span className="text-white font-bold">{forestData.water_level}%</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Break Compliance</p>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Soil Quality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-green-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${forestData.soil_quality}%` }}
                      />
                    </div>
                    <span className="text-white font-bold">{forestData.soil_quality}%</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Ergonomic Score</p>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wind className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-medium">Air Quality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-cyan-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${forestData.air_quality}%` }}
                      />
                    </div>
                    <span className="text-white font-bold">{forestData.air_quality}%</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Stress Level (Inverse)</p>
                </div>
              </div>
            </motion.div>

            {/* Special Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Special Features Unlocked
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className={`rounded-lg p-4 text-center ${forestData.has_flowers ? 'bg-pink-500/20 border-2 border-pink-500/50' : 'bg-gray-800/50 border border-gray-700'}`}>
                  <Flower2 className={`w-8 h-8 mx-auto mb-2 ${forestData.has_flowers ? 'text-pink-400' : 'text-gray-600'}`} />
                  <p className={`text-sm ${forestData.has_flowers ? 'text-pink-300' : 'text-gray-500'}`}>Flowers</p>
                  {!forestData.has_flowers && <p className="text-xs text-gray-600 mt-1">80% health</p>}
                </div>

                <div className={`rounded-lg p-4 text-center ${forestData.has_birds ? 'bg-blue-500/20 border-2 border-blue-500/50' : 'bg-gray-800/50 border border-gray-700'}`}>
                  <Bird className={`w-8 h-8 mx-auto mb-2 ${forestData.has_birds ? 'text-blue-400' : 'text-gray-600'}`} />
                  <p className={`text-sm ${forestData.has_birds ? 'text-blue-300' : 'text-gray-500'}`}>Birds</p>
                  {!forestData.has_birds && <p className="text-xs text-gray-600 mt-1">70% health</p>}
                </div>

                <div className={`rounded-lg p-4 text-center ${forestData.has_butterflies ? 'bg-purple-500/20 border-2 border-purple-500/50' : 'bg-gray-800/50 border border-gray-700'}`}>
                  <Bug className={`w-8 h-8 mx-auto mb-2 ${forestData.has_butterflies ? 'text-purple-400' : 'text-gray-600'}`} />
                  <p className={`text-sm ${forestData.has_butterflies ? 'text-purple-300' : 'text-gray-500'}`}>Butterflies</p>
                  {!forestData.has_butterflies && <p className="text-xs text-gray-600 mt-1">60% health</p>}
                </div>

                <div className={`rounded-lg p-4 text-center ${forestData.has_stream ? 'bg-cyan-500/20 border-2 border-cyan-500/50' : 'bg-gray-800/50 border border-gray-700'}`}>
                  <Waves className={`w-8 h-8 mx-auto mb-2 ${forestData.has_stream ? 'text-cyan-400' : 'text-gray-600'}`} />
                  <p className={`text-sm ${forestData.has_stream ? 'text-cyan-300' : 'text-gray-500'}`}>Stream</p>
                  {!forestData.has_stream && <p className="text-xs text-gray-600 mt-1">70% breaks</p>}
                </div>

                <div className={`rounded-lg p-4 text-center ${forestData.has_bench ? 'bg-amber-500/20 border-2 border-amber-500/50' : 'bg-gray-800/50 border border-gray-700'}`}>
                  <span className="text-3xl">🪑</span>
                  <p className={`text-sm mt-2 ${forestData.has_bench ? 'text-amber-300' : 'text-gray-500'}`}>Bench</p>
                  {!forestData.has_bench && <p className="text-xs text-gray-600 mt-1">70% air</p>}
                </div>

                <div className={`rounded-lg p-4 text-center ${forestData.has_rocks ? 'bg-gray-500/20 border-2 border-gray-500/50' : 'bg-gray-800/50 border border-gray-700'}`}>
                  <span className="text-3xl">🪨</span>
                  <p className={`text-sm mt-2 ${forestData.has_rocks ? 'text-gray-300' : 'text-gray-500'}`}>Rocks</p>
                </div>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-forest-dark/30 to-forest-green/30 backdrop-blur-sm rounded-xl p-6 border border-forest-green/50"
            >
              <h3 className="text-xl font-semibold text-white mb-3">🌟 Forest Insights</h3>
              <div className="space-y-2 text-gray-200">
                {forestData.forest_health_score >= 80 && (
                  <p>✨ Your forest is thriving! Keep up the excellent wellness habits.</p>
                )}
                {forestData.forest_health_score >= 60 && forestData.forest_health_score < 80 && (
                  <p>🌱 Your forest is healthy and growing. A few improvements can make it thrive!</p>
                )}
                {forestData.forest_health_score < 60 && forestData.forest_health_score >= 40 && (
                  <p>🍂 Your forest needs some care. Focus on improving your wellness habits.</p>
                )}
                {forestData.forest_health_score < 40 && (
                  <p>⚠️ Your forest needs urgent attention. Consider taking breaks and improving posture.</p>
                )}
                
                {forestData.growth_rate < 0 && (
                  <p className="text-orange-300">📉 Your forest health is declining. Try to improve your wellness routine.</p>
                )}
                {forestData.growth_rate > 5 && (
                  <p className="text-green-300">📈 Great progress! Your forest is growing rapidly.</p>
                )}
                
                {forestData.air_quality < 40 && (
                  <p className="text-red-300">💨 High stress detected. Take breaks and practice relaxation.</p>
                )}
                {forestData.water_level < 50 && (
                  <p className="text-blue-300">💧 Take more regular breaks to keep your forest hydrated.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessForest;
