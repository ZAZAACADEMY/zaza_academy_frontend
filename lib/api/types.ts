export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  roles: any[];
  age_group: string | null;
  country: string | null;
  email_verified_at: string | null;
  is_active: boolean;
  is_2fa_enabled: boolean;
}

export interface AuthResponse {
  requires_2fa: boolean;
  access?: string;
  refresh?: string;
  user?: User;
  token?: string; // Temporary token for 2FA
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country?: string;
  password_confirm?: string;
  [key: string]: any;
}

export interface UserProfile extends User {
  // Keeping compatibility with existing code that might use UserProfile
}

export interface ChildProfile {
  id: string;
  first_name: string;
  age: number;
  avatar?: string;
}
