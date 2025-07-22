import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    medications: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Get user from localStorage and mock additional profile data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Mock additional profile data - replace with actual API call
      const mockProfileData = {
        ...userData,
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        gender: 'Other',
        address: '123 Main Street, City, State 12345',
        emergencyContact: 'Jane Doe - +1 (555) 987-6543',
        medicalHistory: 'No significant medical history',
        allergies: 'None known',
        medications: 'None'
      };

      setUser(mockProfileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }));

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadUserProfile(); // Reload original data
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 hover:bg-gray-100 rounded"
          >
            <Icon name="arrow-left" className="text-gray-600" />
          </button>
          <h2 className="text-3xl font-bold flex items-center">
            <Icon name="user" className="mr-2 text-green-500" />
            My Profile
          </h2>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Icon name="edit" className="mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Icon name="spinner" className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="save" className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow">
        {/* Basic Information */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="user-circle" className="mr-2 text-blue-500" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={user.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={user.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="phone" className="mr-2 text-red-500" />
            Emergency Contact
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact (Name & Phone)
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={user.emergencyContact}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="e.g., John Doe - +1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* Medical Information */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="heart" className="mr-2 text-red-500" />
            Medical Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={user.medicalHistory}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
                placeholder="Brief description of your medical history..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={user.allergies}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="2"
                  placeholder="List any known allergies..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  name="medications"
                  value={user.medications}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="2"
                  placeholder="List current medications..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
