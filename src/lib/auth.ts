import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
// import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  // pages: {
  //   signIn: "/sign-in",
  //   verifyRequest: '/verify-request', // (used for check email message)
  //   newUser: '/new-user'
  // },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "e.g johnsmith" },
        password: { label: "Password", type: "password", placeholder: "e.g ...." }
      },
      async authorize(credentials) {

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.username }
        });
        if (!existingUser) {
          return null;
        };

        // const passwordMatch = await compare(credentials.password, existingUser.password)
        // if (!passwordMatch) {
        //   return null;
        // };

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
        }

      }
    }),
    GithubProvider({
      clientId: "Iv1.c1b1d372f6d05146",
      clientSecret: "5b7137e108077940750a59211fa29fd4d5780bbc",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id, // Include the user's ID in the token
          // username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id, // Include the user's ID in the session.user object
          username: token.username,
        },
      };
    },
  }

}