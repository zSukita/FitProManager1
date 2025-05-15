export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  planId?: string;
}

export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  email?: string;
}
