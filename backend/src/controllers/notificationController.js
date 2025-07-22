// In-memory storage for notifications (temporary solution)
let notifications = [];
let notificationIdCounter = 1;

// Get notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const userNotifications = notifications
      .filter(notif => notif.user === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userNotifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(notif => 
      notif.id === parseInt(req.params.id) && notif.user === req.user.id
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notifications[notificationIndex].read = true;
    notifications[notificationIndex].updatedAt = new Date();
    
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(notif => 
      notif.id === parseInt(req.params.id) && notif.user === req.user.id
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notifications.splice(notificationIndex, 1);
    
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create a notification (for backend use)
exports.createNotification = async (userId, message, type = 'info', title = 'Notification') => {
  const notification = {
    id: notificationIdCounter++,
    user: userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  notifications.push(notification);
  return notification;
};

// Get all notifications (for admin/debugging)
exports.getAllNotifications = async (req, res) => {
  try {
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
