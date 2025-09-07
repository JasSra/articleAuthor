// React hooks for notifications and messaging
import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { 
  createNotificationService, 
  createMessagingService,
  NotificationService,
  MessagingService,
  AppNotification,
  UserMessage 
} from '@/lib/notificationService';
import { toast } from 'react-hot-toast';

export function useNotifications() {
  const { jwt } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const serviceRef = useRef<NotificationService | null>(null);

  // Initialize notification service
  useEffect(() => {
    if (jwt) {
      serviceRef.current = createNotificationService(jwt);
      return () => {
        serviceRef.current?.stopNotificationStream();
        serviceRef.current = null;
      };
    }
  }, [jwt]);

  // Start notification stream
  useEffect(() => {
    if (serviceRef.current) {
      // Subscribe to incoming notifications
      const unsubscribe = serviceRef.current.subscribe('all', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast for high priority notifications
        if (notification.type === 'error' || notification.metadata?.priority === 'high') {
          toast.error(notification.message, {
            duration: 6000,
            position: 'top-right'
          });
        } else if (notification.type === 'success') {
          toast.success(notification.message, {
            duration: 4000,
            position: 'top-right'
          });
        } else {
          toast(notification.message, {
            icon: notification.type === 'warning' ? '⚠️' : 'ℹ️',
            duration: 3000,
            position: 'top-right'
          });
        }
      });

      // Start the notification stream
      serviceRef.current.startNotificationStream({
        channels: ['web'],
        userId: 'current' // Will be handled by the service
      });

      return () => {
        unsubscribe();
      };
    }
  }, [jwt]); // Depend on jwt instead of serviceRef.current

  // Load notification history
  const loadNotificationHistory = useCallback(async () => {
    if (serviceRef.current) {
      try {
        const history = await serviceRef.current.getNotificationHistory({
          channels: ['web'],
          take: 50
        });
        setNotifications(history);
        setUnreadCount(history.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to load notification history:', error);
      }
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Send notification
  const sendNotification = useCallback(async (notification: {
    type: 'article-event' | 'collaboration';
    title: string;
    message: string;
    recipientUserId: string;
    metadata?: Record<string, any>;
  }) => {
    if (serviceRef.current) {
      try {
        await serviceRef.current.publishNotification({
          id: `${notification.type}-${Date.now()}`,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          userId: notification.recipientUserId,
          channel: 'web',
          priority: 'normal',
          ts: Date.now()
        });
        return true;
      } catch (error) {
        console.error('Failed to send notification:', error);
        return false;
      }
    }
    return false;
  }, []);

  return {
    notifications,
    unreadCount,
    loadNotificationHistory,
    markAsRead,
    clearAll,
    sendNotification
  };
}

export function useMessaging() {
  const { jwt } = useAuth();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const serviceRef = useRef<MessagingService | null>(null);

  // Initialize messaging service
  useEffect(() => {
    if (jwt) {
      serviceRef.current = createMessagingService(jwt);
    }
  }, [jwt]);

  // Load messages
  const loadMessages = useCallback(async (options: {
    page?: number;
    size?: number;
    since?: string;
  } = {}) => {
    if (serviceRef.current) {
      try {
        const messageList = await serviceRef.current.getMessages(options);
        setMessages(messageList);
        setUnreadMessages(messageList.filter(m => !m.read).length);
        return messageList;
      } catch (error) {
        console.error('Failed to load messages:', error);
        return [];
      }
    }
    return [];
  }, []);

  // Mark message as read
  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (serviceRef.current) {
      const success = await serviceRef.current.markAsRead(messageId);
      if (success) {
        setMessages(prev => 
          prev.map(m => 
            m.id === messageId ? { ...m, read: true } : m
          )
        );
        setUnreadMessages(prev => Math.max(0, prev - 1));
      }
      return success;
    }
    return false;
  }, []);

  // Mark message as unread
  const markMessageAsUnread = useCallback(async (messageId: string) => {
    if (serviceRef.current) {
      const success = await serviceRef.current.markAsUnread(messageId);
      if (success) {
        setMessages(prev => 
          prev.map(m => 
            m.id === messageId ? { ...m, read: false } : m
          )
        );
        setUnreadMessages(prev => prev + 1);
      }
      return success;
    }
    return false;
  }, []);

  // Remove all messages
  const removeAllMessages = useCallback(async () => {
    if (serviceRef.current) {
      const success = await serviceRef.current.removeAllMessages();
      if (success) {
        setMessages([]);
        setUnreadMessages(0);
        toast.success('All messages removed');
      }
      return success;
    }
    return false;
  }, []);

  // Send article notification
  const sendArticleNotification = useCallback(async (options: {
    type: 'submitted' | 'approved' | 'rejected' | 'published' | 'mentioned';
    articleId: string;
    articleTitle: string;
    recipientUserId: string;
    senderUserId: string;
    message?: string;
  }) => {
    if (serviceRef.current) {
      return await serviceRef.current.sendArticleNotification(options);
    }
    return false;
  }, []);

  // Send collaboration notification
  const sendCollaborationNotification = useCallback(async (options: {
    type: 'comment' | 'mention' | 'shared' | 'review-request';
    articleId: string;
    articleTitle: string;
    recipientUserId: string;
    senderUserId: string;
    senderName: string;
    message?: string;
  }) => {
    if (serviceRef.current) {
      return await serviceRef.current.sendCollaborationNotification(options);
    }
    return false;
  }, []);

  return {
    messages,
    unreadMessages,
    loadMessages,
    markMessageAsRead,
    markMessageAsUnread,
    removeAllMessages,
    sendArticleNotification,
    sendCollaborationNotification
  };
}

// Combined hook for both notifications and messaging
export function useUserCommunication() {
  const notifications = useNotifications();
  const messaging = useMessaging();

  const totalUnread = notifications.unreadCount + messaging.unreadMessages;

  return {
    ...notifications,
    ...messaging,
    totalUnread
  };
}
