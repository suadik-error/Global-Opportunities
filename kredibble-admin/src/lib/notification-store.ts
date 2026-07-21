/**
 * Client-side store for admin-sent broadcast notifications.
 * Mirrors the class-store pattern used throughout kredibble-app
 * (authStore, communityStore, profileStore) — in-memory only, no backend.
 */

export type Audience = 'seekers' | 'hirers' | 'both';

export interface SentNotification {
  id: string;
  title: string;
  message: string;
  audience: Audience;
  sentAt: string;
}

const initialHistory: SentNotification[] = [
  {
    id: 'sent-1',
    title: 'Welcome to Kredibble',
    message: 'Complete your profile to start receiving personalized opportunity matches.',
    audience: 'seekers',
    sentAt: '1 Jul 2026, 9:00 AM',
  },
  {
    id: 'sent-2',
    title: 'New verification requirements',
    message: 'All hirer accounts must complete document verification by end of month to keep posting.',
    audience: 'hirers',
    sentAt: '10 Jul 2026, 2:30 PM',
  },
];

class NotificationBroadcastStore {
  history: SentNotification[] = [...initialHistory];

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  send(title: string, message: string, audience: Audience) {
    const entry: SentNotification = {
      id: `sent-${Date.now()}`,
      title,
      message,
      audience,
      sentAt: new Date().toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
      }),
    };
    this.history = [entry, ...this.history];
    this.notify();
  }
}

export const notificationBroadcastStore = new NotificationBroadcastStore();
