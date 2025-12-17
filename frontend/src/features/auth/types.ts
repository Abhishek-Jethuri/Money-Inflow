import type { UserProfile } from "../settings/types";

export interface User {
  _id: string;
  name: string;
  email: string;
  profile?: UserProfile;
  token?: string;
  refreshToken?: string;
}
