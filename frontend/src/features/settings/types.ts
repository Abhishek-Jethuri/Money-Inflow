export interface UserProfile {
  _id?: string;
  user: string;
  currency: string;
  language: string;
  theme: "light" | "dark";
  timezone?: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}
