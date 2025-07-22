import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon';

function NotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/notifications', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load notifications');
        setLoading(false);
      });
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-8">
      <div className="flex items-center mb-4">
        <Icon name="bell" className="mr-2 text-yellow-500 text-xl" />
        <span className="font-semibold text-lg">Notifications</span>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500">No notifications yet.</div>
      ) : (
        <ul className="divide-y">
          {notifications.map(n => (
            <li key={n._id} className={`py-2 flex items-center ${n.read ? 'opacity-60' : ''}`}>
              <Icon name={n.type === 'success' ? 'check-circle' : n.type === 'error' ? 'times-circle' : n.type === 'warning' ? 'exclamation-triangle' : 'info-circle'} className={`mr-2 ${n.type === 'success' ? 'text-green-500' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-yellow-600' : 'text-blue-500'}`} />
              <span className="flex-1">{n.message}</span>
              <span className="text-xs text-gray-400 mr-2">{new Date(n.createdAt).toLocaleString()}</span>
              {!n.read && (
                <button className="text-blue-500 text-xs underline ml-2" onClick={() => markAsRead(n._id)}>Mark as read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsSection;
