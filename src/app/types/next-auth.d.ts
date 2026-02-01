import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "customer" | "artisan";
      name: string | null;
      shopName: string | null;
      bio: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "customer" | "artisan";
    name: string | null;
    shopName: string | null;
    bio: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "customer" | "artisan";
    name: string | null;
    shopName: string | null;
    bio: string | null;
  }
}
