import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle2, AlertCircle, Loader2, Trash2, RefreshCw } from 'lucide-react';

const UserProfileCard = ({ 
  userProfile, 
  profileStatus, 
  loadingProfile, 
  onRefresh, 
  onDelete 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 rounded-3xl border border-forest-light/20 shadow-2xl mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-forest-light flex items-center gap-2">
          <User className="w-6 h-6" />
          My Gait Profile
        </h2>
        <button
          onClick={onRefresh}
          disabled={loadingProfile}
          className="flex items-center gap-2 px-4 py-2 bg-forest-light/10 text-forest-light rounded-xl font-semibold hover:bg-forest-light/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loadingProfile ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loadingProfile ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <Loader2 className="w-8 h-8 text-forest-light animate-spin mx-auto mb-2" />
            <p className="text-forest-light/60">Loading profile...</p>
          </motion.div>
        ) : userProfile ? (
          <motion.div
            key="profile-exists"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                <p className="text-forest-light/60 text-sm mb-1">Profile ID</p>
                <p className="text-forest-light font-semibold">#{userProfile.id}</p>
              </div>
              <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                <p className="text-forest-light/60 text-sm mb-1">Created</p>
                <p className="text-forest-light font-semibold">
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                <p className="text-forest-light/60 text-sm mb-1">Embedding Size</p>
                <p className="text-forest-light font-semibold">{userProfile.embedding_dimension}D</p>
              </div>
              <div className="bg-forest-light/5 rounded-xl p-4 border border-forest-light/10">
                <p className="text-forest-light/60 text-sm mb-1">Status</p>
                <p className={`font-semibold flex items-center gap-1 capitalize ${
                  profileStatus?.status === 'completed' ? 'text-green-400' : 
                  profileStatus?.status === 'processing' ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>
                  {profileStatus?.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : profileStatus?.status === 'processing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {profileStatus?.status === 'completed' ? 'Active' : profileStatus?.status || 'Active'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-forest-light/10">
              <p className="text-forest-light/70 text-sm">
                {profileStatus?.status === 'completed' 
                  ? '✅ Your gait profile is ready for recognition'
                  : profileStatus?.status === 'processing'
                  ? '⏳ Your profile is being processed...'
                  : 'Your gait profile is active and ready for recognition'
                }
              </p>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl font-semibold hover:bg-red-500/20 transition-all border border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
                Delete Profile
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-8 bg-forest-light/5 rounded-xl border border-forest-light/10"
          >
            <AlertCircle className="w-12 h-12 text-forest-light/50 mx-auto mb-3" />
            <p className="text-forest-light font-semibold mb-2">No Gait Profile Found</p>
            <p className="text-forest-light/60 text-sm">
              Upload a video below to create your gait profile
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserProfileCard;
