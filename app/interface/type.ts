export interface Post {
  id: string;
  title: string;
  description: string;
  status: string;
  link: string;
  images: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Tags {
  id: string;
  nameTag: string;
}

export interface Alltags {
  tag: Tags[];
}

export interface PostPagination {
  data: Post[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface AllPosts {
  data: PostPagination;
}

export interface PostById {
  post: Post;
}

export interface CvItem {
  id: number;
  name_cv: string;
  original_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CvResponse {
  cv: CvItem[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
}

export interface MessagePagination {
  data: Message[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface AllMessages {
  data: MessagePagination;
}