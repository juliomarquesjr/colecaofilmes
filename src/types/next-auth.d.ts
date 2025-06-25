import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    username: string;
    isAdmin: boolean;
  }
} 