import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import { User } from './models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email as string });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;
        return { id: user._id.toString(), email: user.email, name: user.username };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { (session.user as any).id = token.id as string; }
      return session;
    },
  },
});
