import api from "@/lib/api";

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  gender: string;
  companyName: string;
  position: string;
  tel: string;
  address: string;
  detailAddress: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

