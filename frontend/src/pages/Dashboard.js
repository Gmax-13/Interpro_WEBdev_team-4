import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    unreadNotifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data and dashboard stats
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get user from localStorage (from login)
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);

      // Mock data for demonstration - replace with actual API calls
      const mockAppointments = [
        {
          id: 1,
          doctorName: 'Dr. Smith',
          clinicName: 'City Medical Center',
          date: '2025-07-20',
          time: '10:00 AM',
          status: 'confirmed'
        },
        {
          id: 2,
          doctorName: 'Dr. Johnson',
          clinicName: 'Health Plus Clinic',
          date: '2025-07-22',
          time: '2:30 PM',
          status: 'pending'
        }
      ];

      const mockNotifications = [
        {
          id: 1,
          message: 'Appointment confirmed with Dr. Smith',
          type: 'success',
          time: '2 hours ago',
          read: false
        },
        {
          id: 2,
          message: 'Reminder: Appointment tomorrow at 10:00 AM',
          type: 'info',
          time: '1 day ago',
          read: false
        },
        {
          id: 3,
          message: 'Profile updated successfully',
          type: 'success',
          time: '3 days ago',
          read: true
        }
      ];

      setAppointments(mockAppointments);
      setNotifications(mockNotifications);
      setStats({
        totalAppointments: mockAppointments.length,
        upcomingAppointments: mockAppointments.filter(apt => new Date(apt.date) >= new Date()).length,
        unreadNotifications: mockNotifications.filter(notif => !notif.read).length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentClick = () => {
    navigate('/appointments');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setStats(prev => ({
      ...prev,
      unreadNotifications: prev.unreadNotifications - 1
    }));
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <Icon name="dashboard" className="mr-2 text-blue-500" /> Dashboard
      </h2>
      
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4 text-gray-700 flex items-center text-xl">
          <Icon name="user-circle" className="mr-3 text-purple-500" /> 
          Welcome back, {user?.name || 'User'}!
        </div>
        <p className="text-gray-600">Here's what's happening with your healthcare today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={handleAppointmentClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <Icon name="calendar" className="text-blue-600 text-3xl mb-2" />
              <div className="font-semibold text-lg">Appointments</div>
              <div className="text-sm text-gray-600">Manage your appointments</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{stats.upcomingAppointments}</div>
              <div className="text-xs text-gray-500">Upcoming</div>
            </div>
          </div>
        </div>

        <div 
          className="bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={handleProfileClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <Icon name="user" className="text-green-600 text-3xl mb-2" />
              <div className="font-semibold text-lg">Profile</div>
              <div className="text-sm text-gray-600">Update your details</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        <div 
          className="bg-yellow-50 rounded-lg p-6 cursor-pointer hover:bg-yellow-100 transition-colors"
          onClick={handleNotificationClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <Icon name="bell" className="text-yellow-600 text-3xl mb-2" />
              <div className="font-semibold text-lg">Notifications</div>
              <div className="text-sm text-gray-600">Check your alerts</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">{stats.unreadNotifications}</div>
              <div className="text-xs text-gray-500">Unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="calendar" className="mr-2 text-blue-500" />
            Recent Appointments
          </h3>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 3).map(appointment => (
                <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-medium">{appointment.doctorName}</div>
                  <div className="text-sm text-gray-600">{appointment.clinicName}</div>
                  <div className="text-sm text-gray-500">
                    {appointment.date} at {appointment.time}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments scheduled</p>
          )}
          <button 
            onClick={handleAppointmentClick}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all appointments →
          </button>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Icon name="bell" className="mr-2 text-yellow-500" />
            Recent Notifications
          </h3>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 3).map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded cursor-pointer ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                  onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                >
                  <div className={`text-sm ${
                    notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'
                  }`}>
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No notifications</p>
          )}
          <button 
            onClick={handleNotificationClick}
            className="mt-4 text-yellow-600 hover:text-yellow-800 text-sm font-medium"
          >
            View all notifications →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
