import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, CheckCircle2, AlertCircle, Loader2, User } from 'lucide-react';
import UserProfileCard from '../../components/user/UserProfileCard';

const UserProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!authToken) {
        console.log('No auth token found');
        return;
      }

      const statusResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gait/profile-status`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setProfileStatus(statusData);
        console.log('Profile status:', statusData);

        if (statusData.status !== 'not_found') {
          const profileResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gait/user-profile`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'accept': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            }
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            setUserProfile(profileData);
            console.log('User profile:', profileData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const deleteUserProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your gait profile? This action cannot be undone.')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gait/user-profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile deleted:', data);
        setUserProfile(null);
        setProfileStatus({ status: 'not_found', message: 'No gait profile found' });
        setUploadStatus({ type: 'success', message: data.message || 'Profile deleted successfully' });
      } else {
        throw new Error('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setUploadStatus({ type: 'error', message: 'Failed to delete profile' });
    }
  };

  const pollProfileStatus = async (authToken) => {
    let attempts = 0;
    const maxAttempts = 60;
    
    console.log('🔄 Starting to poll profile status...');
    
    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        console.log('⏱️ Polling timeout reached');
        setUploadStatus({ 
          type: 'success', 
          message: 'Processing is taking longer than expected. Please refresh manually.' 
        });
        return;
      }
      
      attempts++;
      console.log(`📊 Checking profile status (attempt ${attempts}/${maxAttempts})...`);
      
      try {
        const statusResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gait/profile-status`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('Profile status:', statusData.status);
          
          if (statusData.status === 'completed') {
            console.log('✅ Profile processing completed!');
            setUploadStatus({ 
              type: 'success', 
              message: '✅ Profile completed! Your gait profile is ready.' 
            });
            
            await fetchUserProfile();
            
            setTimeout(() => {
              setUploadStatus(null);
            }, 3000);
            
            return;
          } else if (statusData.status === 'processing') {
            console.log('⏳ Still processing...');
            setUploadStatus({ 
              type: 'success', 
              message: `Processing your video... (${attempts * 2}s elapsed)` 
            });
            
            setTimeout(checkStatus, 2000);
          } else if (statusData.status === 'failed' || statusData.status === 'error') {
            console.error('❌ Processing failed');
            setUploadStatus({ 
              type: 'error', 
              message: 'Profile processing failed. Please try again.' 
            });
            return;
          } else {
            setTimeout(checkStatus, 2000);
          }
        } else {
          console.error('Failed to fetch profile status');
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error polling profile status:', error);
        setTimeout(checkStatus, 2000);
      }
    };
    
    setTimeout(checkStatus, 2000);
  };

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
      console.log('File selected:', file.name);
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setUploadStatus(null);
      } else {
        setUploadStatus({ type: 'error', message: 'Please upload a video file' });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!authToken) {
        setUploadStatus({ type: 'error', message: 'Please log in to upload videos' });
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Uploading file:', selectedFile.name);

      const uploadResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/gait/upload-user-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      const contentType = uploadResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || `Upload failed`);
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload success:', uploadData);
      
      setUploadStatus({ 
        type: 'success', 
        message: uploadData.message || 'Video uploaded successfully. Processing in background.' 
      });
      
      pollProfileStatus(authToken);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-night-blue to-forest-900 pt-24 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="w-10 h-10 text-forest-light" />
            <h1 className="text-4xl md:text-5xl font-black text-forest-light">
              My Profile
            </h1>
          </div>
          <p className="text-lg text-forest-light/70 max-w-2xl mx-auto">
            Manage your gait profile for AI-powered recognition and security
          </p>
        </motion.div>

        {/* User Profile Card */}
        <UserProfileCard
          userProfile={userProfile}
          profileStatus={profileStatus}
          loadingProfile={loadingProfile}
          onRefresh={fetchUserProfile}
          onDelete={deleteUserProfile}
        />

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
                  {userProfile ? 'Update Gait Profile' : 'Create Gait Profile'}
                </h3>
                <p className="text-forest-light/60 mb-6">
                  {userProfile 
                    ? 'Upload a new video to update your gait profile'
                    : 'Upload your gait video to create your unique profile'
                  }
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
                <p className="text-sm text-forest-light/70 mt-2 font-medium">
                  {userProfile ? '⚠️ This will replace your existing profile' : '✨ First time? Let\'s create your profile!'}
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
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-8 py-3 bg-forest-light text-forest-900 rounded-xl font-bold hover:bg-forest-light/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload & Process
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadStatus(null);
                    }}
                    disabled={uploading}
                    className="px-8 py-3 border-2 border-forest-light/30 text-forest-light rounded-xl font-bold hover:bg-forest-light/10 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
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
      </div>
    </div>
  );
};

export default UserProfile;
