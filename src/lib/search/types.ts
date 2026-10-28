export type MessageSearchResult = {
  user: {
    user_id: string;
    user_name: string;
    avatar_url: string;
    default_avatar_url?: string;
    is_deactivated?: boolean;
    is_restricted?: boolean;
  };
  messages: Array<{
    message_id: string;
    thread_id?: string;
    message: string;
    timestamp: string;
  }>;
  thread?: {
    id?: string;
  };
  channel: {
    channel_id: string;
    channel_name: string;
    channel_type?: string;
  };
};

export type UserSearchResult = {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  profile_url: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
  entity_type: string;
  avatar_url?: string;
  is_deactivated?: boolean;
  is_restricted?: boolean;
};

export type SearchSortBy = "relevance" | "newest" | "oldest" | string;

export type SearchDateFilter = {
  type: string;
  value: string;
};

export type MessageSearchFilters = {
  from?: string;
  channel?: string;
  date?: SearchDateFilter;
  sortBy?: SearchSortBy;
};
