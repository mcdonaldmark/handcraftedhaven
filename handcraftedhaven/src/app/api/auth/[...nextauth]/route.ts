import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Guard against undefined credentials
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // TEMP user (replace with DB lookup later)
        return {
          id: "1",
          email: credentials.email,
          role: "artisan", // change to "customer" to test
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "customer" | "artisan";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
