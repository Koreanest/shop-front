export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type MeResponse = {
  memberId: number;
};