import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "USER";
  }
}
