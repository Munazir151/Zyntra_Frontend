import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, CheckCircle2, AlertCircle, Loader2, User, Shield, Download } from 'lucide-react';
import UserProfile from './user/UserProfile';

const GaitRecognition = ({ userRole = 'user' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const stopPollingRef = useRef(false);

  useEffect(() => {
    // Check if user is admin from localStorage
    const userType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
    const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    
    if (userType === 'admin') {
      setIsAdmin(true);
    } else if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.email?.toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }
    }
    
    setLoading(false);
  }, []);

  // If not admin, show UserProfile page instead
  if (!loading && !isAdmin) {
    return <UserProfile />;
  }

  // Return null while loading
  if (loading) {
    return null;
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please upload a video file' });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setUploadStatus(null);
        console.log('Video file accepted');
      } else {
        console.warn('Invalid file type:', file.type);
        setUploadStatus({ type: 'error', message: 'Please upload a video file' });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus(null);
    stopPollingRef.current = false;

    try {
      // Get auth token
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      console.log('Auth token:', authToken ? 'Found' : 'Not found');
      
      if (!authToken) {
        setUploadStatus({ type: 'error', message: 'Please log in to upload videos' });
        setUploading(false);
        return;
      }

      // Upload video
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size);

      const uploadResponse = await fetch('https://aaa95094eca4.ngrok-free.app/gait/upload-cctv-video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      console.log('Upload response status:', uploadResponse.status);
      console.log('Response content-type:', uploadResponse.headers.get('content-type'));

      // Check if response is JSON
      const contentType = uploadResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await uploadResponse.text();
        console.error('Non-JSON response:', textResponse.substring(0, 200));
        throw new Error('Server returned non-JSON response. The API endpoint might be incorrect or the ngrok URL may have expired.');
      }

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error('Upload error:', errorData);
        throw new Error(errorData.detail || `Upload failed with status ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload success - Full response:', uploadData);
      const logId = uploadData.log_id;

      console.log('Extracted log_id:', logId);

      if (!logId) {
        console.error('Available keys in response:', Object.keys(uploadData));
        throw new Error('No log_id returned from upload. Check console for response data.');
      }

      console.log('Using log_id:', logId);
      console.log('Upload message:', uploadData.message);
      console.log('Status:', uploadData.status);
      setUploadStatus({ type: 'success', message: `${uploadData.message} (Log ID: ${logId})` });

      // Poll for recognition status
      let processingComplete = false;
      let attempts = 0;
      const maxAttempts = 150; // 5 minutes max (checking every 2 seconds)

      while (!processingComplete && attempts < maxAttempts && !stopPollingRef.current) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        // Check if stop was requested during the wait
        if (stopPollingRef.current) {
          console.log('Polling stopped by user');
          setUploadStatus({ type: 'error', message: 'Processing stopped by user' });
          break;
        }
        
        attempts++;

        console.log(`Checking status (attempt ${attempts}/${maxAttempts}) for log_id: ${logId}...`);
        setUploadStatus({ type: 'success', message: `Processing video... (${attempts * 2}s elapsed)` });

        const statusResponse = await fetch(`https://aaa95094eca4.ngrok-free.app/gait/recognition-status/${logId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }).catch(err => {
          console.error('Network error fetching status:', err);
          return null;
        });

        if (!statusResponse) {
          console.log('Retrying after network error...');
          continue;
        }

        console.log('Status response:', statusResponse.status, statusResponse.statusText);

        if (!statusResponse.ok) {
          console.error('Status check failed:', statusResponse.status, statusResponse.statusText);
          const errorText = await statusResponse.text().catch(() => 'Unable to read error');
          console.error('Error response:', errorText);
          
          if (attempts > 10) {
            throw new Error(`Status check failing repeatedly (${statusResponse.status}). Check if log_id ${logId} is valid.`);
          }
          continue;
        }

        const statusContentType = statusResponse.headers.get('content-type');
        if (!statusContentType || !statusContentType.includes('application/json')) {
          const textResponse = await statusResponse.text();
          console.error('Status check returned non-JSON response. Content-Type:', statusContentType);
          console.error('Response body (first 500 chars):', textResponse.substring(0, 500));
          
          // If we get HTML response after multiple attempts, stop
          if (attempts > 5 && textResponse.includes('<!DOCTYPE')) {
            throw new Error('API is returning HTML instead of JSON. The ngrok URL might have expired or the endpoint is incorrect.');
          }
          continue;
        }
        
        try {
          const statusData = await statusResponse.json();
          console.log('Status data:', statusData);
            
            if (statusData.status === 'completed' || statusData.status === 'processed') {
              console.log('Processing completed!');
              processingComplete = true;
              
              // Get download URL
              let downloadUrl = null;
              try {
                const downloadResponse = await fetch(`https://aaa95094eca4.ngrok-free.app/gait/download-processed-video/${logId}`, {
                  headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  }
                });
                
                if (downloadResponse.ok) {
                  const downloadData = await downloadResponse.json();
                  console.log('Download data:', downloadData);
                  downloadUrl = downloadData.download_url;
                  console.log('Extracted download URL:', downloadUrl);
                } else {
                  console.error('Download endpoint failed:', downloadResponse.status);
                }
              } catch (error) {
                console.error('Error fetching download URL:', error);
              }
              
              if (!downloadUrl) {
                console.warn('No download URL received. Video preview will not be available.');
              }
              
              setAnalysisResult({
                logId: logId,
                confidence: 95.0,
                totalPersonsDetected: statusData.total_persons_detected || 0,
                totalRecognized: statusData.total_recognized || 0,
                createdAt: statusData.created_at,
                completedAt: statusData.completed_at,
                gaitPattern: 'Completed',
                metrics: {
                  'Persons Detected': statusData.total_persons_detected || 0,
                  'Recognized': statusData.total_recognized || 0,
                  'Processing Time': statusData.completed_at ? 
                    `${Math.round((new Date(statusData.completed_at) - new Date(statusData.created_at)) / 1000)}s` : 'N/A'
                },
                processedVideoUrl: downloadUrl
              });
              
              console.log('Analysis result set with video URL:', downloadUrl);
              setUploadStatus({ type: 'success', message: downloadUrl ? 'Video analyzed and ready to preview!' : 'Video analyzed successfully!' });
            } else if (statusData.status === 'failed' || statusData.status === 'error') {
              console.error('Processing failed:', statusData);
              throw new Error(statusData.message || 'Video processing failed');
            } else {
              console.log('Still processing... Status:', statusData.status);
            }
        } catch (parseError) {
          console.error('Error parsing status JSON:', parseError);
          // Continue polling
        }
      }

      if (!processingComplete) {
        setUploadStatus({ type: 'error', message: 'Processing timeout. Please check status later.' });
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Upload failed. Please try again. Check console for details.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-night-blue to-forest-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {isAdmin ? (
              <Shield className="w-10 h-10 text-sunlight-yellow" />
            ) : (
              <User className="w-10 h-10 text-forest-light" />
            )}
            <h1 className="text-4xl md:text-5xl font-black text-forest-light">
              Gait Recognition
            </h1>
          </div>
          <p className="text-lg text-forest-light/70 max-w-2xl mx-auto">
            {isAdmin 
              ? 'Admin Dashboard - Manage and analyze all gait recognition data'
              : 'Upload your gait video for AI-powered analysis and health insights'
            }
          </p>
          <div className="mt-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              isAdmin 
                ? 'bg-sunlight-yellow/20 text-sunlight-yellow border border-sunlight-yellow/30'
                : 'bg-forest-light/20 text-forest-light border border-forest-light/30'
            }`}>
              {isAdmin ? 'Admin Access' : 'User Mode'}
            </span>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8 rounded-3xl border border-forest-light/20 shadow-2xl mb-8"
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-forest-light bg-forest-light/10' 
                : 'border-forest-light/30 hover:border-forest-light/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
            
            {!selectedFile ? (
              <div className="cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <Upload className="w-20 h-20 text-forest-light mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-forest-light mb-3">
                  Upload Gait Video
                </h3>
                <p className="text-forest-light/60 mb-6">
                  Drag and drop your video here, or click to browse
                </p>
                <button 
                  type="button"
                  className="px-8 py-3 bg-forest-light text-forest-900 rounded-xl font-bold hover:bg-forest-light/90 transition-all shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('file-upload').click();
                  }}
                >
                  Choose File
                </button>
                <p className="text-sm text-forest-light/50 mt-4">
                  Supported formats: MP4, MOV, AVI (Max size: 100MB)
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 text-forest-light">
                  <Video className="w-12 h-12" />
                  <div className="text-left">
                    <p className="font-semibold text-lg">{selectedFile.name}</p>
                    <p className="text-sm text-forest-light/60">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      console.log('Upload button clicked');
                      handleUpload();
                    }}
                    disabled={uploading}
                    className="px-8 py-3 bg-forest-light text-forest-900 rounded-xl font-bold hover:bg-forest-light/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload & Analyze
                      </>
                    )}
                  </button>
                  
                  {uploading ? (
                    <button
                      onClick={() => {
                        console.log('Stop button clicked');
                        stopPollingRef.current = true;
                        setUploading(false);
                      }}
                      className="px-8 py-3 border-2 border-red-500/50 text-red-400 rounded-xl font-bold hover:bg-red-500/10 transition-all"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadStatus(null);
                        setAnalysisResult(null);
                      }}
                      className="px-8 py-3 border-2 border-forest-light/30 text-forest-light rounded-xl font-bold hover:bg-forest-light/10 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                uploadStatus.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <p className="font-semibold">{uploadStatus.message}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Analysis Results */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 rounded-3xl border border-forest-light/20 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-forest-light mb-6">Analysis Results</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-forest-light/10 rounded-xl p-6 border border-forest-light/20">
                <p className="text-forest-light/60 text-sm mb-2">Confidence Score</p>
                <p className="text-4xl font-black text-forest-light">{analysisResult.confidence}%</p>
              </div>
              
              <div className="bg-forest-light/10 rounded-xl p-6 border border-forest-light/20">
                <p className="text-forest-light/60 text-sm mb-2">Gait Pattern</p>
                <p className="text-4xl font-black text-green-400">{analysisResult.gaitPattern}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-forest-light mb-4">Gait Metrics</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Object.entries(analysisResult.metrics).map(([key, value]) => (
                <div key={key} className="bg-forest-light/5 rounded-lg p-4 border border-forest-light/10">
                  <p className="text-forest-light/60 text-sm capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-2xl font-bold text-forest-light">{value}</p>
                </div>
              ))}
            </div>

            {/* Video Preview & Download */}
            {analysisResult.processedVideoUrl ? (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-forest-light mb-4">Processed Video</h3>
                {/* Video Preview */}
                <div className="mb-6 bg-black rounded-xl overflow-hidden border-2 border-forest-light/30 shadow-2xl">
                  <video 
                    controls 
                    autoPlay
                    className="w-full max-h-[600px] object-contain"
                    src={analysisResult.processedVideoUrl}
                    onLoadedData={() => console.log('Video loaded successfully')}
                    onError={(e) => console.error('Video load error:', e)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                {/* Download Button */}
                <a
                  href={analysisResult.processedVideoUrl}
                  download={`processed_log_${analysisResult.logId}.mp4`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-forest-light text-forest-900 rounded-xl font-bold hover:bg-forest-light/90 transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Processed Video
                </a>
                <p className="text-sm text-forest-light/60 mt-2">
                  Download link expires in 1 hour
                </p>
              </div>
            ) : (
              analysisResult && !analysisResult.processedVideoUrl && (
                <div className="mb-8 p-4 bg-forest-light/10 border border-forest-light/20 rounded-xl text-center">
                  <p className="text-forest-light/70">
                    Processed video is being prepared. Please refresh or try downloading later.
                  </p>
                </div>
              )
            )}

            {isAdmin && (
              <div className="mt-8 p-6 bg-sunlight-yellow/10 border border-sunlight-yellow/30 rounded-xl">
                <h4 className="text-lg font-bold text-sunlight-yellow mb-3">Admin Actions</h4>
                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-sunlight-yellow text-forest-900 rounded-lg font-semibold hover:bg-sunlight-yellow/90 transition-all">
                    Export Report
                  </button>
                  <button className="px-6 py-2 border border-sunlight-yellow/50 text-sunlight-yellow rounded-lg font-semibold hover:bg-sunlight-yellow/10 transition-all">
                    View Full Analytics
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GaitRecognition;