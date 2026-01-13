import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Admin route
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      // Dashboard / other protected routes
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
