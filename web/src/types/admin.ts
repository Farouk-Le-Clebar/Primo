export type UserType = {
  id: string;
  firstName: string;
  surName: string;
  email: string;
  lastConnection: string | Date | null;
  createdAt?: string;
  isAdmin: boolean;
  profilePicture: string | null;
  provider?: string;
  verified?: boolean;
};

export type UserStatistic = {
  id: string;
  userId: string;
  connectedAt: string;
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  country: string | null;
  city: string | null;
  ipAddress: string | null;
  language: string | null;
};
