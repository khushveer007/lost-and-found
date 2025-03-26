/**
 * Shared type definitions for the application
 */

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  status: string;
  image_url?: string;
  user_id: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FormError {
  hasError: boolean;
  message: string | null;
  field: string | null;
  timestamp: number;
}
