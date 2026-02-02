export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Ajoutez d'autres champs selon le modèle User Django
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Ajoutez d'autres champs requis pour l'inscription
}

export interface UserProfile extends User {
  role: "parent" | "child" | "admin";
  subscriptionStatus: "active" | "inactive" | "trial";
  children?: ChildProfile[];
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar?: string;
}
