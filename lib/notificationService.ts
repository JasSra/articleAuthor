// Notification and Messaging Service
import { MessageService, NotificationsService } from '@/api/consolidated';
import { withAuthenticatedAPI } from '@/lib/consolidatedApi';
import { handleApiCall } from '@/lib/apiErrorHandler';
import type { NotificationEvent } from '@/api/consolidated';

export interface UserMessage {
  id: string;
  from: string;
  to: string;
  subject?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'direct' | 'system' | 'workflow' | 'mention';
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  id: string;
  label: string;
  url?: string;
  action?: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export class NotificationService {
  private jwt: string;
  private eventListeners = new Map<string, Set<(notification: AppNotification) => void>>();
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(jwt: string) {
    this.jwt = jwt;
  }

  // Real-time notification streaming
  async startNotificationStream(options: {
    channels?: string[];
    tenantId?: string;
    organizationId?: string;
    userId?: string;
  } = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (options.channels?.length) params.append('channels', options.channels.join(','));
      if (options.tenantId) params.append('tenantId', options.tenantId);
      if (options.organizationId) params.append('organizationId', options.organizationId);
      if (options.userId) params.append('userId', options.userId);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
      const url = `${baseUrl}/api/Notifications/stream?${params.toString()}`;

      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('Notification stream connected');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data) as AppNotification;
          this.handleIncomingNotification(notification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };

      this.eventSource.onerror = () => {
        console.warn('Notification stream error');
        this.handleStreamError();
      };
    } catch (error) {
      console.error('Failed to start notification stream:', error);
    }
  }

  stopNotificationStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Subscribe to notification events
  subscribe(event: string, callback: (notification: AppNotification) => void): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(event);
        }
      }
    };
  }

  // Publish notification
  async publishNotification(notification: NotificationEvent): Promise<boolean> {
    const result = await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        NotificationsService.postApiNotificationsPublish(notification)
      ),
      {
        context: 'Publish Notification',
        showToast: false
      }
    );

    return result !== null;
  }

  // Get notification history
  async getNotificationHistory(options: {
    channels?: string[];
    tenantId?: string;
    organizationId?: string;
    userId?: string;
    sinceId?: string;
    take?: number;
  } = {}): Promise<AppNotification[]> {
    const result = await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        NotificationsService.getApiNotificationsHistory(
          options.channels?.join(','),
          options.tenantId,
          options.organizationId,
          options.userId,
          options.sinceId,
          options.take
        )
      ),
      {
        context: 'Get Notification History',
        showToast: false
      }
    );

    return result || [];
  }

  private handleIncomingNotification(notification: AppNotification): void {
    // Emit to all subscribers
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach(callback => {
        try {
          callback(notification);
        } catch (error) {
          console.error('Notification callback error:', error);
        }
      });
    });
  }

  private handleStreamError(): void {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      
      setTimeout(() => {
        console.log(`Attempting to reconnect notification stream (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
        this.startNotificationStream();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached for notification stream');
    }
  }
}

export class MessagingService {
  private jwt: string;

  constructor(jwt: string) {
    this.jwt = jwt;
  }

  // Get messages with pagination
  async getMessages(options: {
    page?: number;
    size?: number;
    since?: string;
  } = {}): Promise<UserMessage[]> {
    const { page = 1, size = 10, since } = options;

    const result = await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        MessageService.getMessages(page, size, since)
      ),
      {
        context: 'Get Messages',
        showToast: false
      }
    );

    if (result?.items) {
      return result.items.map(this.transformMessage);
    }

    return [];
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<boolean> {
    const result = await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        MessageService.markAsRead(messageId)
      ),
      {
        context: 'Mark Message as Read',
        showToast: false,
        silentOn: [404] // Silent if message not found
      }
    );

    return result !== null;
  }

  // Mark message as unread
  async markAsUnread(messageId: string): Promise<boolean> {
    const result = await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        MessageService.markAsUnread(messageId)
      ),
      {
        context: 'Mark Message as Unread',
        showToast: false,
        silentOn: [404]
      }
    );

    return result !== null;
  }

  // Remove all messages
  async removeAllMessages(): Promise<boolean> {
    const result = await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        MessageService.removeAllMessages()
      ),
      {
        context: 'Remove All Messages',
        showToast: true
      }
    );

    return result !== null;
  }

  // Send notification about article events
  async sendArticleNotification(options: {
    type: 'submitted' | 'approved' | 'rejected' | 'published' | 'mentioned';
    articleId: string;
    articleTitle: string;
    recipientUserId: string;
    senderUserId: string;
    message?: string;
  }): Promise<boolean> {
    const { type, articleId, articleTitle, recipientUserId, senderUserId, message } = options;

    const notificationEvent: NotificationEvent = {
      id: `article-${type}-${articleId}-${Date.now()}`,
      type: 'article-event',
      channel: 'web',
      title: this.getArticleNotificationTitle(type, articleTitle),
      message: message || this.getArticleNotificationMessage(type, articleTitle),
      userId: recipientUserId,
      correlationId: `article-${articleId}`,
      priority: type === 'rejected' ? 'high' : 'normal',
      ts: Date.now()
    };

    return this.sendNotification(notificationEvent);
  }

  // Send collaboration notification
  async sendCollaborationNotification(options: {
    type: 'comment' | 'mention' | 'shared' | 'review-request';
    articleId: string;
    articleTitle: string;
    recipientUserId: string;
    senderUserId: string;
    senderName: string;
    message?: string;
  }): Promise<boolean> {
    const { type, articleId, articleTitle, recipientUserId, senderUserId, senderName, message } = options;

    const notificationEvent: NotificationEvent = {
      id: `collab-${type}-${articleId}-${Date.now()}`,
      type: 'collaboration',
      channel: 'web',
      title: this.getCollaborationNotificationTitle(type, senderName, articleTitle),
      message: message || this.getCollaborationNotificationMessage(type, senderName, articleTitle),
      userId: recipientUserId,
      correlationId: `article-${articleId}`,
      priority: type === 'mention' ? 'high' : 'normal',
      ts: Date.now()
    };

    return this.sendNotification(notificationEvent);
  }

  private async sendNotification(event: NotificationEvent): Promise<boolean> {
    return await handleApiCall(
      () => withAuthenticatedAPI(this.jwt, () => 
        NotificationsService.postApiNotificationsPublish(event)
      ),
      {
        context: 'Send Notification',
        showToast: false
      }
    ) !== null;
  }

  private transformMessage(rawMessage: any): UserMessage {
    return {
      id: rawMessage.id,
      from: rawMessage.from || rawMessage.senderId,
      to: rawMessage.to || rawMessage.recipientId,
      subject: rawMessage.subject,
      content: rawMessage.content || rawMessage.message,
      timestamp: rawMessage.timestamp || rawMessage.createdUtc,
      read: rawMessage.read || rawMessage.isRead || false,
      type: rawMessage.type || 'direct'
    };
  }

  private getArticleNotificationTitle(type: string, articleTitle: string): string {
    switch (type) {
      case 'submitted': return `Article Submitted: ${articleTitle}`;
      case 'approved': return `Article Approved: ${articleTitle}`;
      case 'rejected': return `Article Needs Revision: ${articleTitle}`;
      case 'published': return `Article Published: ${articleTitle}`;
      case 'mentioned': return `You were mentioned in: ${articleTitle}`;
      default: return `Article Update: ${articleTitle}`;
    }
  }

  private getArticleNotificationMessage(type: string, articleTitle: string): string {
    switch (type) {
      case 'submitted': return `"${articleTitle}" has been submitted for review.`;
      case 'approved': return `"${articleTitle}" has been approved and is ready for publishing.`;
      case 'rejected': return `"${articleTitle}" needs revisions before it can be approved.`;
      case 'published': return `"${articleTitle}" has been published and is now live.`;
      case 'mentioned': return `You were mentioned in the article "${articleTitle}".`;
      default: return `There's an update to "${articleTitle}".`;
    }
  }

  private getCollaborationNotificationTitle(type: string, senderName: string, articleTitle: string): string {
    switch (type) {
      case 'comment': return `New comment from ${senderName}`;
      case 'mention': return `${senderName} mentioned you`;
      case 'shared': return `${senderName} shared an article with you`;
      case 'review-request': return `Review requested by ${senderName}`;
      default: return `Message from ${senderName}`;
    }
  }

  private getCollaborationNotificationMessage(type: string, senderName: string, articleTitle: string): string {
    switch (type) {
      case 'comment': return `${senderName} commented on "${articleTitle}".`;
      case 'mention': return `${senderName} mentioned you in "${articleTitle}".`;
      case 'shared': return `${senderName} shared "${articleTitle}" with you.`;
      case 'review-request': return `${senderName} requested your review of "${articleTitle}".`;
      default: return `${senderName} sent you a message about "${articleTitle}".`;
    }
  }
}

// Factory functions
export function createNotificationService(jwt: string): NotificationService {
  return new NotificationService(jwt);
}

export function createMessagingService(jwt: string): MessagingService {
  return new MessagingService(jwt);
}
