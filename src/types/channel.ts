/** List/nav snapshot when opening a channel (not full CHANNEL_DETAILS). */
export type ChannelNavContext = {
  channels_id: string;
  is_restricted: boolean;
};

export interface Media {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_link: string;
  size: number;
  organisation_id: string;
  user_id: string;
  folder_id: string | null;
  channel_id: string | null;
  message_id: string | null;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  deleted_at: string | null;
  access_type: string;
  is_shareable: boolean;
}

export interface Thread {
  thread_id: string;
  channels_id: string;
  username: string;
  status: string;
  created_at: string;
  messages: any | null;
  message_count: number;
  last_reply: string;
  avatar_url: string;
  type: "message" | "system";
  message: string;
  channel_name: string;
  channel_type: "public" | "private";
  current_status: "pending" | "success" | "failed";
  full_name: string;
  email: string;
  edited: boolean;
  is_pinned: boolean;
  user_type: "user" | "admin" | "bot";
  user_id: string;
  org_id: string;
  pinned_details: Record<string, any>;
  reactions: any | null;
  media?: Media[];
}

export interface Channel {
  channels_id: string;
  name: string;
  description: string;
  topic: string;
  organisation_id: string;
  owner_id: string;
  owner_name: string;
  is_private: boolean;
  created_at: string;
  thread_count: number;
  access: boolean;
  mention_count: number;
  last_thread_id: string;
  member_avatars: string[];
  members_count: number;
  user_count: number;
  last_post_time: string;
  unread_count: number;
  channel_slug: string;
  preview_thread: Thread[];
  preview_message: string;
  isArchived?: boolean;
  archived?: boolean;
  /** Channel-wide top-level message write restriction */
  is_restricted?: boolean;
  /** When false, automated system notices are hidden for this channel */
  system_message?: boolean;
  restricted?: boolean;
}

export interface Pagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export type ChannelExportStatus =
  | "pending"
  | "processing"
  | "in_progress"
  | "queued"
  | "completed"
  | "failed"
  | string;

export interface ChannelExport {
  id: string;
  channel_id: string;
  user_id: string;
  organisation_id: string;
  status: ChannelExportStatus;
  file_id: string | null;
  file_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface ChannelResponse {
  status: "success" | "error";
  status_code: number;
  message: string;
  data: Channel[];
  pagination: Pagination[];
}
