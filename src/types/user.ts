export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  verified: boolean;
  img?: string;
  role?: string;
  token?: string;
} 