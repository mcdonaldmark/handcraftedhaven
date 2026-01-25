import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return token?.role === "artisan";
    },
  },
});

export const config = {
  matcher: ["/seller/:path*"],
};
