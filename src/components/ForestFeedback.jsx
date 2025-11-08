import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, CloudFog, Flower, Sun, TreeDeciduous, AlertTriangle } from 'lucide-react';

const ForestFeedback = ({ ecoActions, screenTime, forestHealth }) => {
  const [feedback, setFeedback] = useState(null);
  const [prevActions, setPrevActions] = useState({});
  
  useEffect(() => {
    let newFeedback = null;
    
    // Check for new eco actions and show feedback
    if (ecoActions.lightsOff && !prevActions.lightsOff) {
      newFeedback = {
        icon: <Leaf className="text-green-400" size={24} />,
        title: '🌿 New Leaves Growing!',
        message: 'You saved energy today — a new sapling appeared!',
        color: 'from-green-500 to-emerald-600'
      };
    } else if (ecoActions.ecoTravel && !prevActions.ecoTravel) {
      newFeedback = {
        icon: <Flower className="text-pink-400" size={24} />,
        title: '🌼 Flowers Blooming!',
        message: 'Eco-friendly travel detected! 🌻 Nature thanks you.',
        color: 'from-pink-500 to-rose-600'
      };
    } else if (ecoActions.exercise && !prevActions.exercise) {
      newFeedback = {
        icon: <Sun className="text-yellow-400" size={24} />,
        title: '🌞 Sunlight Intensified!',
        message: 'Your calm energy revived the forest.',
        color: 'from-yellow-500 to-orange-600'
      };
    } else if (ecoActions.longWork && !prevActions.longWork) {
      newFeedback = {
        icon: <CloudFog className="text-gray-400" size={24} />,
        title: '☁️ Trees Losing Color',
        message: 'Your forest looks tired — take a walk!',
        color: 'from-gray-500 to-slate-600'
      };
    } else if (screenTime > 4 && !prevActions.highScreenTime) {
      newFeedback = {
        icon: <CloudFog className="text-blue-400" size={24} />,
        title: '🌫️ Digital Fog Appearing',
        message: 'Digital fatigue is spreading — time to rest?',
        color: 'from-blue-500 to-indigo-600'
      };
    } else if (forestHealth < 0.3) {
      newFeedback = {
        icon: <AlertTriangle className="text-red-400" size={24} />,
        title: '🚨 Forest in Danger',
        message: 'Your forest needs urgent care. Log healthy activities!',
        color: 'from-red-500 to-rose-600'
      };
    } else if (forestHealth > 0.8 && forestHealth > prevActions.lastHealth) {
      newFeedback = {
        icon: <TreeDeciduous className="text-emerald-400" size={24} />,
        title: '✨ Forest Thriving!',
        message: 'Your healthy habits are creating a paradise!',
        color: 'from-emerald-500 to-teal-600'
      };
    }
    
    if (newFeedback) {
      setFeedback(newFeedback);
      setTimeout(() => setFeedback(null), 5000); // Hide after 5 seconds
    }
    
    setPrevActions({ 
      ...ecoActions, 
      highScreenTime: screenTime > 4,
      lastHealth: forestHealth 
    });
  }, [ecoActions, screenTime, forestHealth]);
  
  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          className="fixed top-24 md:top-28 right-4 md:right-8 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className={`glass-card p-4 rounded-2xl bg-gradient-to-br ${feedback.color} bg-opacity-20 backdrop-blur-xl border border-white border-opacity-30 shadow-2xl`}>
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {feedback.icon}
              </motion.div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm md:text-base mb-1">
                  {feedback.title}
                </h4>
                <p className="text-white text-opacity-90 text-xs md:text-sm font-light">
                  {feedback.message}
                </p>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-white text-opacity-60 hover:text-opacity-100 transition-all"
              >
                ✕
              </button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="h-1 bg-white bg-opacity-20 rounded-full mt-3 overflow-hidden"
              initial={{ width: '100%' }}
            >
              <motion.div
                className="h-full bg-white bg-opacity-60"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForestFeedback;
