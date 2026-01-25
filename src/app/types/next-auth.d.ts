import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "customer" | "artisan";
    };
  }

  interface User {
    id: string;
    email: string;
    role: "customer" | "artisan";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "customer" | "artisan";
  }
}
