import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  user_id: number;
  email: string;
  password?: string;
  google_id?: string;
  nickname: string;
  title?: string;
  introduction?: string;
  icon_url?: string;
  ai_introduction?: string;
  ai_introduction_vector: 'waiting' | 'success' | 'failure';
  ai_introduction_vector_at?: Date;
  ai_personality?: string;
  latitude?: number;
  longitude?: number;
  country_code?: string;
  country_name?: string;
  region?: string;
  city?: string;
  language_code: string;
  timezone: string;
  utc_offset: string;
  likes: number;
  dislikes: number;
  followers: number;
  chat_photo_url?: string;
  chat_sound_url?: string;
  login_ip?: string;
  login_at?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password?: string;
  google_id?: string;
  nickname: string;
  title?: string;
  introduction?: string;
  icon_url?: string;
  language_code?: string;
  timezone?: string;
  utc_offset?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
