import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          title: 'Appointment Confirmed',
          message: 'Your appointment with Dr. Sarah Smith has been confirmed for July 20, 2025 at 10:00 AM.',
          type: 'success',
          time: '2 hours ago',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          actionable: true,
          action: {
            type: 'view_appointment',
            label: 'View Details',
            data: { appointmentId: 1 }
          }
        },
        {
          id: 2,
          title: 'Appointment Reminder',
          message: 'Don\'t forget! You have an appointment tomorrow at 10:00 AM with Dr. Sarah Smith at City Medical Center.',
          type: 'info',
          time: '1 day ago',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: false,
          actionable: true,
          action: {
            type: 'view_appointment',
            label: 'View Appointment',
            data: { appointmentId: 1 }
          }
        },
        {
          id: 3,
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          type: 'success',
          time: '3 days ago',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: true,
          actionable: false
        },
        {
          id: 4,
          title: 'New Test Results Available',
          message: 'Your recent lab test results are now available. Please review them in your patient portal.',
          type: 'info',
          time: '5 days ago',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          read: true,
          actionable: true,
          action: {
            type: 'view_results',
            label: 'View Results',
            data: { resultId: 1 }
          }
        },
        {
          id: 5,
          title: 'Appointment Cancelled',
          message: 'Your appointment with Dr. Robert Wilson scheduled for July 25, 2025 has been cancelled due to doctor unavailability.',
          type: 'warning',
          time: '1 week ago',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          read: true,
          actionable: true,
          action: {
            type: 'reschedule',
            label: 'Reschedule',
            data: { doctorId: 4 }
          }
        },
        {
          id: 6,
          title: 'Payment Reminder',
          message: 'You have an outstanding balance of $150.00 for your recent visit. Please make a payment at your earliest convenience.',
          type: 'warning',
          time: '2 weeks ago',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          read: false,
          actionable: true,
          action: {
            type: 'make_payment',
            label: 'Pay Now',
            data: { amount: 150.00, invoiceId: 'INV-001' }
          }
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    }
  };

  const handleAction = (notification) => {
    // Handle different action types
    switch (notification.action.type) {
      case 'view_appointment':
        navigate('/appointments');
        break;
      case 'view_results':
        alert('Test results functionality would be implemented here');
        break;
      case 'reschedule':
        alert('Reschedule functionality would be implemented here');
        break;
      case 'make_payment':
        alert('Payment functionality would be implemented here');
        break;
      default:
        console.log('Unknown action type:', notification.action.type);
    }
    
    // Mark as read when action is taken
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: 'text-green-500' };
      case 'info':
        return { name: 'info-circle', color: 'text-blue-500' };
      case 'warning':
        return { name: 'exclamation-triangle', color: 'text-yellow-500' };
      case 'error':
        return { name: 'times-circle', color: 'text-red-500' };
      default:
        return { name: 'bell', color: 'text-gray-500' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading notifications...</div>
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
            <Icon name="bell" className="mr-2 text-yellow-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Icon name="check" className="mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          {[
            { key: 'all', label: 'All Notifications', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                filter === tab.key
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => {
            const iconInfo = getNotificationIcon(notification.type);
            return (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow p-6 ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <Icon 
                      name={iconInfo.name} 
                      className={`${iconInfo.color} text-xl mr-3 mt-1 flex-shrink-0`} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className={`text-lg font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        !notification.read ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {notification.actionable && (
                            <button
                              onClick={() => handleAction(notification)}
                              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                            >
                              {notification.action.label}
                            </button>
                          )}
                          
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                            >
                              Mark as Read
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Icon name="bell" className="text-gray-300 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any notifications yet."
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
