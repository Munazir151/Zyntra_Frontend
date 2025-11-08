import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import ForestScene from '../components/ForestScene';
import ForestFeedback from '../components/ForestFeedback';
import useStore from '../store/useStore';

const EcoScoreOrb = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <motion.div 
      className="absolute top-8 md:top-12 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="glass-card px-8 py-4 text-center">
        <div className="relative">
          {/* Glowing Orb */}
          <motion.div
            className="w-24 h-24 mx-auto mb-4 rounded-full animate-glow"
            style={{
              background: `radial-gradient(circle, ${
                percentage > 70 ? '#FFE156' : 
                percentage > 40 ? '#FFA726' : '#FF6B6B'
              }, transparent)`,
              boxShadow: `0 0 30px ${
                percentage > 70 ? 'rgba(255, 225, 86, 0.8)' : 
                percentage > 40 ? 'rgba(255, 167, 38, 0.8)' : 'rgba(255, 107, 107, 0.8)'
              }`
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
            </div>
          </motion.div>
          
          {/* Label */}
          <h3 className="text-white text-lg font-light mb-2">Eco Score</h3>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: percentage > 70 ? 
                  'linear-gradient(to right, #00A878, #FFE156)' :
                  percentage > 40 ?
                  'linear-gradient(to right, #FFA726, #FFE156)' :
                  'linear-gradient(to right, #FF6B6B, #FFA726)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          {/* Status Text */}
          <motion.p 
            className="text-forest-light text-sm mt-3 font-light"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {percentage > 80 ? '✨ Your forest is thriving!' :
             percentage > 60 ? '🌿 Keep nurturing your forest' :
             percentage > 40 ? '🌤️ Your forest needs attention' :
             '🌧️ Time to restore balance'}
          </motion.p>
        </div>
      </div>
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
      <p className="text-forest-light text-lg font-light">Growing your forest...</p>
    </motion.div>
  </div>
);

const Home = () => {
  const { ecoScore, maxEcoScore, forestHealth, activities } = useStore();
  
  // Calculate eco actions from recent activities
  const ecoActions = useMemo(() => {
    const recentActivities = activities.slice(-10); // Last 10 activities
    
    return {
      lightsOff: recentActivities.some(a => a.type === 'eco-action' && a.notes?.toLowerCase().includes('light')),
      exercise: recentActivities.some(a => a.type === 'exercise' || a.type === 'meditation'),
      ecoTravel: recentActivities.some(a => a.type === 'walk' || (a.type === 'eco-action' && a.notes?.toLowerCase().includes('travel'))),
      longWork: recentActivities.some(a => a.type === 'work' && a.duration > 4),
    };
  }, [activities]);
  
  // Calculate screen time from recent activities
  const screenTime = useMemo(() => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(a => new Date(a.date).toDateString() === today);
    const phoneTime = todayActivities
      .filter(a => a.type === 'phone')
      .reduce((sum, a) => sum + a.duration, 0);
    const workTime = todayActivities
      .filter(a => a.type === 'work' || a.type === 'sedentary')
      .reduce((sum, a) => sum + a.duration, 0);
    return phoneTime + workTime * 0.5; // Work counts as 50% screen time
  }, [activities]);
  
  return (
    <div className="relative w-full h-screen overflow-hidden pt-28 md:pt-32">
      {/* Forest Feedback Notifications */}
      <ForestFeedback 
        ecoActions={ecoActions}
        screenTime={screenTime}
        forestHealth={forestHealth}
      />
      
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
            health={forestHealth} 
            timeOfDay="day"
            ecoActions={ecoActions}
            screenTime={screenTime}
          />
        </Suspense>
      </Canvas>
      
      {/* Ambient Info */}
      <motion.div
        className="absolute bottom-8 left-8 glass-card px-6 py-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white text-sm font-light">
          🌲 Trees: {Math.floor(forestHealth * 30)} / 30
        </p>
        <p className="text-forest-light text-xs mt-1">
          ☀️ Day Mode
        </p>
      </motion.div>
      
      {/* Hint */}
      <motion.div
        className="absolute bottom-8 right-8 text-white text-sm font-light opacity-60"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Drag to explore • Scroll to zoom
      </motion.div>
      
      {/* Loading Overlay */}
      <Suspense fallback={<LoadingScreen />} />
    </div>
  );
};

export default Home;
