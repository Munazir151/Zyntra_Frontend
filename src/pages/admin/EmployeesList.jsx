import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  RefreshCw, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  User,
  Shield
} from 'lucide-react';

const EmployeesList = () => {
  const [adminData, setAdminData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployees = async () => {
    try {
      setRefreshing(true);
      setError('');
      
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins/me/employees`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status}`);
      }

      const data = await response.json();
      setAdminData({
        email: data.email,
        username: data.username,
        full_name: data.full_name,
        id: data.id,
        is_super_admin: data.is_super_admin,
        created_at: data.created_at
      });
      setEmployees(data.employees || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-forest-dark/50 rounded-xl">
                <Users className="w-8 h-8 text-forest-light" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Employees Management</h1>
                <p className="text-gray-300 mt-1">View and manage your team members</p>
              </div>
            </div>
            <button
              onClick={fetchEmployees}
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
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <RefreshCw className="w-8 h-8 text-forest-light animate-spin" />
          </motion.div>
        ) : (
          <>
            {/* Employees Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-gray-300 text-lg">
                Total Employees: <span className="text-white font-semibold">{employees.length}</span>
              </p>
            </motion.div>

            {/* Employees Grid */}
            {employees.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No employees found</p>
                <p className="text-gray-400 text-sm mt-2">Add employees to see them here</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {employees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-night-blue/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700
                             hover:border-forest-green transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Employee Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-forest-dark/50 rounded-lg">
                          <User className="w-6 h-6 text-forest-light" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {employee.full_name}
                          </h3>
                          <p className="text-gray-400 text-sm">@{employee.username}</p>
                        </div>
                      </div>
                      {employee.is_active ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    {/* Employee Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-300 text-sm truncate">{employee.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-300 text-sm">
                          Joined {formatDate(employee.created_at)}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Employee ID</span>
                          <span className="text-white font-medium text-sm">{employee.id}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-400 text-sm">Status</span>
                          <span className={`text-sm font-medium ${
                            employee.is_active ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;
