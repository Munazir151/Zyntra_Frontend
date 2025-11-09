import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Zap, Heart, Droplets, Wind, Users, X, ArrowLeft, Eye, TrendingUp, TrendingDown, Trees } from 'lucide-react';
import ForestScene from '../../components/ForestScene';
import useStore from '../../store/useStore';

const EcoScoreOrb = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  
  const getColor = () => {
    if (percentage > 80) return { bg: '#00A878', accent: '#00D4AA', glow: 'rgba(0, 212, 170, 0.8)' };
    if (percentage > 60) return { bg: '#FFD60A', accent: '#FFE156', glow: 'rgba(255, 225, 86, 0.8)' };
    if (percentage > 40) return { bg: '#FFA726', accent: '#FFB74D', glow: 'rgba(255, 167, 38, 0.8)' };
    return { bg: '#FF6B6B', accent: '#FF8787', glow: 'rgba(255, 107, 107, 0.8)' };
  };
  
  const colors = getColor();
  
  const containerVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const orbVariants = {
    animate: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="absolute top-8 md:top-12 left-1/2 transform -translate-x-1/2 z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="glass-card px-8 py-6 text-center rounded-3xl border border-white border-opacity-10 backdrop-blur-xl"
        variants={floatingVariants}
        animate="animate"
      >
        <div className="relative">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="absolute rounded-full border-2 border-white border-opacity-20"
              style={{ width: '160px', height: '160px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute rounded-full border-2 border-white border-opacity-10"
              style={{ width: '200px', height: '200px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Glowing Orb */}
          <motion.div
            className="w-28 h-28 mx-auto mb-6 rounded-full relative"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${colors.bg})`,
              boxShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
            }}
            variants={orbVariants}
            animate="animate"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-4xl font-bold text-white drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {score}
              </motion.span>
            </div>
          </motion.div>
          
          {/* Label with animation */}
          <motion.h3 
            className="text-white text-xl font-light mb-3"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Eco Score
          </motion.h3>
          
          {/* Enhanced Progress Bar */}
          <div className="w-80 h-3 bg-white bg-opacity-10 rounded-full overflow-hidden border border-white border-opacity-20 backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${colors.bg}, ${colors.accent})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Percentage Text */}
          <motion.p 
            className="text-white text-sm font-medium mt-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {Math.round(percentage)}%
          </motion.p>

          {/* Status Text */}
          <motion.p 
            className="text-forest-light text-sm mt-3 font-light"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
          >
            {percentage > 80 ? '✨ Your forest is thriving!' :
             percentage > 60 ? '🌿 Keep nurturing your forest' :
             percentage > 40 ? '🌤️ Your forest needs attention' :
             '🌧️ Time to restore balance'}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-night-blue">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-16 h-16 mx-auto mb-4 border-4 border-forest-green border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-forest-light text-lg font-light">Getting forest of employees...</p>
    </motion.div>
  </div>
);

const Home = () => {
  const [allForests, setAllForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'

  // Fetch all employee forests
  useEffect(() => {
    const fetchAllForests = async () => {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wellness/forests`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAllForests(data.forests || []);
          console.log('All forests loaded:', data);
        }
      } catch (err) {
        console.error('Error fetching forests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllForests();
  }, []);

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

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: "spring"
      }
    })
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Grid View - Show all employee forests as previews
  if (viewMode === 'grid') {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-night-blue via-forest-dark to-night-deep p-8 pt-32">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-forest-light" />
                Employee Wellness Forests
              </h1>
              <p className="text-forest-light">Overview of all employee wellness metrics</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{allForests.length}</p>
              <p className="text-forest-light text-sm">Total Employees</p>
            </div>
          </div>
        </motion.div>

        {/* No Data Message */}
        {allForests.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white text-xl mb-2">No employee forests found</p>
            <p className="text-forest-light">Employees need to set up their wellness forests first.</p>
          </div>
        )}

        {/* Forests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allForests.map((forest, index) => (
            <motion.div
              key={forest.user_id}
              className="glass-card rounded-2xl overflow-hidden border border-white border-opacity-10 hover:border-opacity-30 transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => {
                setSelectedEmployee(forest);
                setViewMode('detail');
              }}
            >
              {/* Mini Canvas Preview */}
              <div className="h-48 bg-gradient-to-br from-forest-dark to-night-blue relative overflow-hidden">
                <Canvas>
                  <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
                    <ForestScene 
                      health={(forest.forest_health_score || 50) / 100} 
                      timeOfDay="day"
                      wellnessData={forest}
                    />
                  </Suspense>
                </Canvas>
                <div className="absolute top-2 right-2">
                  <motion.div
                    className="bg-black bg-opacity-50 backdrop-blur-sm rounded-full p-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2">{forest.username || `User ${forest.user_id}`}</h3>
                
                {/* Health Score */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-sm">Forest Health</span>
                    <span className={`text-lg font-bold ${getHealthColor(forest.forest_health_score || 50)}`}>
                      {forest.forest_health_score || 50}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getHealthBg(forest.forest_health_score || 50)} transition-all`}
                      style={{ width: `${forest.forest_health_score || 50}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white bg-opacity-5 rounded-lg p-2">
                    <p className="text-gray-400">Trees</p>
                    <p className="text-white font-bold">{forest.total_trees || 0}</p>
                  </div>
                  <div className="bg-white bg-opacity-5 rounded-lg p-2">
                    <p className="text-gray-400">Growth</p>
                    <p className={`font-bold flex items-center gap-1 ${(forest.growth_rate || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(forest.growth_rate || 0) > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(forest.growth_rate || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                  {(forest.forest_health_score || 50) >= 80 && (
                    <span className="inline-block bg-green-500 bg-opacity-20 text-green-400 text-xs px-2 py-1 rounded-full">
                      ✨ Excellent
                    </span>
                  )}
                  {(forest.forest_health_score || 50) >= 60 && (forest.forest_health_score || 50) < 80 && (
                    <span className="inline-block bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                      🌿 Good
                    </span>
                  )}
                  {(forest.forest_health_score || 50) >= 40 && (forest.forest_health_score || 50) < 60 && (
                    <span className="inline-block bg-orange-500 bg-opacity-20 text-orange-400 text-xs px-2 py-1 rounded-full">
                      ⚠️ Needs Attention
                    </span>
                  )}
                  {(forest.forest_health_score || 50) < 40 && (
                    <span className="inline-block bg-red-500 bg-opacity-20 text-red-400 text-xs px-2 py-1 rounded-full">
                      🚨 Critical
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Detail View - Show single employee's full forest
  if (viewMode === 'detail' && selectedEmployee) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-night-blue via-forest-dark to-night-deep">
        {/* Back Button */}
        <motion.button
          className="absolute top-24 left-6 z-50 glass-card px-4 py-2 rounded-xl border border-white border-opacity-20 hover:border-opacity-40 transition-all flex items-center gap-2"
          onClick={() => setViewMode('grid')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5 text-forest-light" />
          <span className="text-white font-medium">Back to Grid</span>
        </motion.button>

        {/* Employee Info Header */}
        <motion.div
          className="absolute top-24 right-6 z-50 glass-card px-4 py-2 rounded-xl border border-white border-opacity-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-white font-semibold text-base mb-1">{selectedEmployee.username || `User ${selectedEmployee.user_id}`}</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-xs">Health:</span>
            <span className={`text-lg font-bold ${getHealthColor(selectedEmployee.forest_health_score || 50)}`}>
              {selectedEmployee.forest_health_score || 50}%
            </span>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 right-1/4 w-96 h-96 bg-forest-green rounded-full mix-blend-screen opacity-5"
            animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/4 w-80 h-80 bg-sunlight-yellow rounded-full mix-blend-screen opacity-3"
            animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, delay: 1 }}
          />
        </div>
        
        {/* 3D Forest Canvas */}
        <Canvas shadows className="w-full h-full">
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
            <OrbitControls 
              enableRotate={true}
              enablePan={true}
              enableZoom={true}
              minDistance={8}
              maxDistance={25}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={0}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.5}
              zoomSpeed={0.8}
              autoRotate={false}
            />
            <ForestScene 
              health={(selectedEmployee.forest_health_score || 50) / 100} 
              timeOfDay="day"
              wellnessData={selectedEmployee}
            />
          </Suspense>
        </Canvas>

        {/* Quick Stats - Bottom Left */}
        <motion.div
          className="absolute bottom-8 left-8 grid grid-cols-2 gap-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card px-4 py-3 rounded-2xl backdrop-blur-xl border border-white border-opacity-10">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-forest-light text-xs">Total Trees</p>
                <p className="text-white font-bold text-lg">{selectedEmployee.total_trees || 0}</p>
              </div>
            </div>
          </div>
          <div className="glass-card px-4 py-3 rounded-2xl backdrop-blur-xl border border-white border-opacity-10">
            <div className="flex items-center gap-2">
              {(selectedEmployee.growth_rate || 0) > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className="text-forest-light text-xs">Growth Rate</p>
                <p className={`font-bold text-lg ${(selectedEmployee.growth_rate || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(selectedEmployee.growth_rate || 0) > 0 ? '+' : ''}{(selectedEmployee.growth_rate || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Panel - Bottom Right */}
        <motion.div
          className="absolute bottom-8 right-8 glass-card px-6 py-4 rounded-2xl backdrop-blur-xl border border-white border-opacity-10 z-10"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Wind className="w-5 h-5 text-sunlight-yellow" />
            <p className="text-white text-sm font-light">
              Employee Forest View
            </p>
          </div>
          <p className="text-forest-light text-xs opacity-70">
            ☀️ {selectedEmployee.time_of_day || 'day'} • Drag to explore • Scroll to zoom
          </p>
        </motion.div>

        {/* Hint - Below Header */}
        <motion.div
          className="absolute top-36 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="glass-card px-4 py-2 rounded-full text-forest-light text-xs font-light">
            🌱 Viewing {selectedEmployee.username || 'employee'}'s wellness forest
          </div>
        </motion.div>
      </div>
    );
  }

  // Fallback
  return null;
};;

export default Home;
