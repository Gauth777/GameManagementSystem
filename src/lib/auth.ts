import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const player = await prisma.player.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            username: true,
            email: true,
            passwordHash: true,
            role: true,
            avatarUrl: true,
          },
        });

        if (!player) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          player.passwordHash
        );
        if (!isValid) return null;

        return {
          id: String(player.id),
          name: player.username,
          email: player.email,
          role: player.role as string,
          username: player.username,
          image: player.avatarUrl,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
