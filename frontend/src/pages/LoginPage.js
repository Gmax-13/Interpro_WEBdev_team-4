import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { requestLocationPermission } from '../services/locationService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Request location permission after successful login
        try {
          const location = await requestLocationPermission();
          console.log('Location permission granted:', location);
        } catch (locationError) {
          console.warn('Location permission denied or failed:', locationError.message);
          // Continue without location - not blocking
        }
        
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header with Branding */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full shadow-lg">
              <Icon name="hospital" className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DigitalClinic</h1>
          <p className="text-gray-600 mb-8">Healthcare Made Simple</p>
          
          {/* Doctor Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-green-100 p-3 rounded-full">
              <Icon name="user-md" className="text-green-600 text-2xl" />
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Icon name="stethoscope" className="text-blue-600 text-2xl" />
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Icon name="heartbeat" className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to access your healthcare dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <Icon name="exclamation-triangle" className="mr-2" />
                {error}
              </div>
            )}
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Icon name="envelope" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Icon name="lock" />
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon name="spinner" className="mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Icon name="sign-in" className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button" 
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
        
        {/* Features */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by thousands of patients</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <Icon name="shield" className="mr-1" />
              Secure
            </div>
            <div className="flex items-center">
              <Icon name="clock" className="mr-1" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <Icon name="check" className="mr-1" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
