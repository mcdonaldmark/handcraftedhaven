import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

type AuthUser = {
  id: string;
  email: string;
  role: "customer" | "artisan";
  name: string | null;
  shopName: string | null;
  bio: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;


        return {
          id: user.id,
          email: user.email,
          role: user.role as "customer" | "artisan",
          name: user.name,
          shopName: user.shopName,
          bio: user.bio,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {

      if (user) {
        const authUser = user as AuthUser;
        token.role = authUser.role;
        token.shopName = authUser.shopName;
        token.bio = authUser.bio;
        token.name = authUser.name;
        token.id = authUser.id;
      }


      if (trigger === "update" && session) {

        return {
          ...token,
          name: session.name ?? token.name,
          shopName: session.shopName ?? token.shopName,
          bio: session.bio ?? token.bio
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).shopName = token.shopName;
        (session.user as any).bio = token.bio;
        session.user.name = token.name;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
