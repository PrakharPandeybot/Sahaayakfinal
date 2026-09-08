const Notification = require("../models/Notification");

// Create a notification
const createNotification = async ({
  recipient,
  type,
  title,
  message,
  booking = null,
}) => {
  return await Notification.create({
    recipient,
    type,
    title,
    message,
    booking,
  });
};

// Get notifications for a user
const getUserNotifications = async (userId) => {
  return await Notification.find({
    recipient: userId,
  })
    .populate("booking", "service scheduledDate status")
    .sort({ createdAt: -1 });
};

// Mark one notification as read
const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    return null;
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};