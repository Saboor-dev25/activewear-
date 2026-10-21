export type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type AdminDocument = {
  _id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
};
