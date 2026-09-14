import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import User from "@/models/User";
import connectDB from "@/lib/db";
import clientPromise from "@/lib/mongoDb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectDB();
        const email = credentials?.email;
        const password = credentials?.password;

        if (!password || !email) return null;

        const lowerCaseEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: lowerCaseEmail });

        if (!user) return null;

        const passMatch = await bcrypt.compare(password, user.password);

        if (!passMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          clinicId: user.clinicId?.toString() || null,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.clinicId = user.clinicId;
        token.role = user.role;
        token.image = user.image || null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.clinicId = token.clinicId;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
