interface UserDetails {
  name: string;
  email: string;
  password: string;
  refreshToken?: string | null;
}

interface UserDetailsWithId extends UserDetails {
  id: string;
}

export declare global {
  namespace Express {
    interface Request {
      user: UserDetailsWithId;
    }
  }
}
