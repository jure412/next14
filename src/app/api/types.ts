export interface User {
  username: string;
  email: string;
  profileImageUrl: string;
  id: string;
}

export interface Session {
  id: string;
  userId: string;
  fresh: boolean;
  expiresAt: string;
}

export interface Data {
  user: User;
  session: Session;
}

export interface ApiResponse {
  msg: string[];
  success: boolean;
  data?: Data;
}

export interface GetProps {
  params: {
    id: string;
  };
}
