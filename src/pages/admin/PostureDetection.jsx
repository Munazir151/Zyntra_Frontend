import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Upload, 
  Video, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  TrendingUp,
  Heart,
  Zap,
  Brain,
  Target,
  X
} from 'lucide-react';

const PostureDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }

    setUploading(true);
    setError('');
    setAnalysisResult(null);

    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posture/analyze-cctv-demo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      console.log('Posture analysis result:', data);
    } catch (err) {
      console.error('Error analyzing posture:', err);
      setError(err.message || 'Failed to analyze posture');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPostureColor = (posture) => {
    switch (posture?.toLowerCase()) {
      case 'good':
        return 'text-green-400';
      case 'neutral':
        return 'text-yellow-400';
      case 'poor':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStressColor = (stress) => {
    switch (stress?.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-deep via-night-blue to-night-deep p-6 pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-forest-dark/50 rounded-xl">
              <Activity className="w-8 h-8 text-forest-light" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Posture Detection</h1>
              <p className="text-gray-300 mt-1">Analyze employee posture and wellness from CCTV footage</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-forest-light" />
              Upload CCTV Video
            </h2>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-forest-green bg-forest-green/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              
              {!selectedFile ? (
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Drop your video here or click to browse</p>
                  <p className="text-gray-400 text-sm">Supports MP4, AVI, MOV formats</p>
                </label>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <Video className="w-8 h-8 text-forest-light" />
                  <div className="text-left">
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 
                       bg-forest-green hover:bg-forest-dark text-white rounded-lg 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing Video...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Analyze Posture
                </>
              )}
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
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <p className="text-gray-400 text-sm">Persons Detected</p>
                </div>
                <p className="text-2xl font-bold text-white">{analysisResult.persons_detected}</p>
              </div>

              <div className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-green-400" />
                  <p className="text-gray-400 text-sm">Avg Wellness Score</p>
                </div>
                <p className="text-2xl font-bold text-white">{analysisResult.overall_avg_wellness?.toFixed(1)}%</p>
              </div>

              <div className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <p className="text-gray-400 text-sm">High Risk Count</p>
                </div>
                <p className="text-2xl font-bold text-white">{analysisResult.high_risk_count}</p>
              </div>

              <div className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <p className="text-gray-400 text-sm">Frames Processed</p>
                </div>
                <p className="text-2xl font-bold text-white">{analysisResult.total_frames_processed}</p>
              </div>
            </div>

            {/* Person Analysis Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-forest-light" />
                Individual Analysis
              </h2>

              {analysisResult.person_analyses?.map((person, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">{person.person_id}</h3>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{person.total_frames_detected} frames detected</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <p className="text-gray-400 text-sm">Ergonomic Score</p>
                      </div>
                      <p className="text-xl font-bold text-white">{person.avg_ergonomic_score}%</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <p className="text-gray-400 text-sm">Posture Quality</p>
                      </div>
                      <p className="text-xl font-bold text-white">{person.avg_posture_quality?.toFixed(1)}%</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-purple-400" />
                        <p className="text-gray-400 text-sm">Dominant Posture</p>
                      </div>
                      <p className={`text-xl font-bold capitalize ${getPostureColor(person.dominant_posture)}`}>
                        {person.dominant_posture}
                      </p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-yellow-400" />
                        <p className="text-gray-400 text-sm">Stress Level</p>
                      </div>
                      <p className={`text-xl font-bold capitalize ${getStressColor(person.stress_level)}`}>
                        {person.stress_level}
                      </p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <p className="text-gray-400 text-sm">Fatigue Indicator</p>
                      </div>
                      <p className="text-xl font-bold text-white">{(person.fatigue_indicator * 100).toFixed(0)}%</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-green-400" />
                        <p className="text-gray-400 text-sm">Wellness Score</p>
                      </div>
                      <p className="text-xl font-bold text-white">{person.overall_wellness_score?.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Posture Distribution</p>
                      <div className="space-y-1">
                        {Object.entries(person.posture_distribution || {}).map(([posture, percentage]) => (
                          <div key={posture} className="flex items-center justify-between">
                            <span className="text-white capitalize">{posture}</span>
                            <span className={`font-bold ${getPostureColor(posture)}`}>{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-2">Activity Distribution</p>
                      <div className="space-y-1">
                        {Object.entries(person.activity_distribution || {}).map(([activity, percentage]) => (
                          <div key={activity} className="flex items-center justify-between">
                            <span className="text-white capitalize">{activity}</span>
                            <span className="font-bold text-blue-400">{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Risk Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Neck Pain Risk</p>
                      <p className={`text-2xl font-bold ${person.neck_pain_risk > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {person.neck_pain_risk}%
                      </p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Back Pain Risk</p>
                      <p className={`text-2xl font-bold ${person.back_pain_risk > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {person.back_pain_risk}%
                      </p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Mood Estimate</p>
                      <p className="text-2xl font-bold text-purple-400 capitalize">
                        {person.mood_estimate}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Session Info */}
            <div className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Video Filename</p>
                  <p className="text-white font-medium">{analysisResult.video_filename}</p>
                </div>
                <div>
                  <p className="text-gray-400">Analysis Duration</p>
                  <p className="text-white font-medium">{analysisResult.analysis_duration_seconds?.toFixed(2)}s</p>
                </div>
                <div>
                  <p className="text-gray-400">Session ID</p>
                  <p className="text-white font-medium text-xs">{analysisResult.session_id}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostureDetection;
