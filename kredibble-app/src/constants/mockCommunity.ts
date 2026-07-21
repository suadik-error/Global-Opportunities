export interface Channel {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  followed: boolean;
}

export interface Post {
  id: string;
  channelId: string;
  title?: string;
  bannerImage?: string;
  body: string;
  link?: string;
  linkText?: string;
  date: string;
  hasRespondButton?: boolean;
  reactions: { emoji: string; count: number; userReacted: boolean }[];
}

export const initialChannels: Channel[] = [
  {
    id: 'breaking-into-tech',
    name: 'Breaking Into Tech Successfully',
    avatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&auto=format&fit=crop&q=80',
    followers: '200 followers',
    lastMessage: 'Job Opportunities Alert!!! A very smart and technical graphics with 10+ years of experience...',
    time: '1:27',
    unreadCount: 65,
    followed: true,
  },
  {
    id: 'tech-maniac',
    name: 'Tech Maniac',
    avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&auto=format&fit=crop&q=80',
    followers: '58k followers',
    followed: false,
  },
  {
    id: 'levelup-hq',
    name: 'LevelUp HQ',
    avatar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&auto=format&fit=crop&q=80',
    followers: '58k followers',
    followed: false,
  },
  {
    id: 'dev-guild',
    name: 'Dev Guild',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80',
    followers: '42k followers',
    followed: false,
  },
  {
    id: 'product-peak',
    name: 'Product Peak',
    avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80',
    followers: '12k followers',
    followed: false,
  },
  {
    id: 'design-spark',
    name: 'Design Spark',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    followers: '25k followers',
    followed: false,
  },
  // Hirer-managed channels (kept in sync with authStore's default ManagedGroups
  // so a channel tap resolves to the same feed for both Seeker and Hirer roles).
  {
    id: 'group-1',
    name: 'Google Tech Circle',
    avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&auto=format&fit=crop&q=80',
    followers: '1.2k followers',
    followed: false,
  },
  {
    id: 'group-2',
    name: 'Designers @ Google Accra',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    followers: '850 followers',
    followed: false,
  }
];

export const mockFeedPosts: Post[] = [
  {
    id: 'post-1',
    channelId: 'breaking-into-tech',
    body: 'The channel "Breaking into Tech Successfully" was created',
    date: '9 Feb 2025',
    reactions: [],
  },
  {
    id: 'post-2',
    channelId: 'breaking-into-tech',
    title: 'Chulabhorn Graduate Institute Scholarship in Thailand',
    bannerImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80', // Beautiful Thailand temple placeholder
    body: 'Chulabhorn Graduate Institute Scholarship 2027 in Thailand (Fully Funded) - Bright Scholarship\n\nApplications are invited to apply for the Chulabhorn Graduate Institute Scholarship 2027 in Thailand. Apply now for CGI Thailand Scholarship.',
    link: 'brightscholarship.com',
    linkText: 'brightscholarship.com',
    date: '9 Feb 2025',
    hasRespondButton: true,
    reactions: [
      { emoji: '😂', count: 5, userReacted: false },
      { emoji: '😭', count: 3, userReacted: false },
      { emoji: '😢', count: 1, userReacted: false },
      { emoji: '😂', count: 4, userReacted: false }, // design shows multiple emojis, can use standard ones
      { emoji: '😆', count: 2, userReacted: false },
      { emoji: '❤️', count: 8, userReacted: false },
    ],
  },
  {
    id: 'post-3',
    channelId: 'breaking-into-tech',
    body: 'JOB VACANCY : WAREHOUSE AND INVENTORY OFFICER\nLOCATION: NORTH KANESHIE: ACCRA\n\nWe are looking for a reliable, organized, and detail-oriented Warehouse and Inventory Officer to join our team in North Kaneshie.\n\nKey Responsibilities:\n🎗 Manage daily warehouse operations and inventory stock levels\n🎗 Conduct regular stock counts and maintain accurate records\n🎗 Receive, inspect, and dispatch goods\n🎗 Ensure proper storage, labeling, and safety standards\n🎗 Prepare inventory reports and reconcile discrepancies\n\nRequirements:\n🎯 Minimum HND/Diploma in Supply Chain, Logistics, or related field\n🎯 At least 2 years of relevant experience in warehouse/inventory management',
    date: '9 Feb 2025',
    reactions: [
      { emoji: '❤️', count: 12, userReacted: false },
      { emoji: '🔥', count: 6, userReacted: false },
      { emoji: '👍', count: 15, userReacted: false }
    ],
  }
];

// Helper to keep track of followed state in-memory during session
class CommunityStateStore {
  channels = [...initialChannels];
  posts = [...mockFeedPosts];
  listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  followChannel(id: string) {
    const channel = this.channels.find(c => c.id === id);
    if (channel) {
      channel.followed = true;
      this.notify();
    }
  }

  unfollowChannel(id: string) {
    const channel = this.channels.find(c => c.id === id);
    if (channel) {
      channel.followed = false;
      this.notify();
    }
  }

  dismissChannel(id: string) {
    this.channels = this.channels.filter(c => c.id !== id);
    this.notify();
  }

  addChannel(channel: Channel) {
    this.channels = [...this.channels, channel];
    this.notify();
  }

  addPost(channelId: string, body: string, extra?: { title?: string; bannerImage?: string }) {
    const post: Post = {
      id: `post-${Date.now()}`,
      channelId,
      body,
      title: extra?.title,
      bannerImage: extra?.bannerImage,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reactions: [],
    };
    this.posts = [...this.posts, post];
    this.notify();
  }

  addReaction(postId: string, emoji: string) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      const rx = post.reactions.find(r => r.emoji === emoji);
      if (rx) {
        if (rx.userReacted) {
          rx.count -= 1;
          rx.userReacted = false;
        } else {
          rx.count += 1;
          rx.userReacted = true;
        }
      } else {
        post.reactions.push({ emoji, count: 1, userReacted: true });
      }
      this.notify();
    }
  }

  addResponseMessage(postId: string, message: string) {
    // Add mocked message to the post or log it
    console.log(`User responded to ${postId}: ${message}`);
  }
}

export const communityStore = new CommunityStateStore();
