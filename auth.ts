import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và mật khẩu là bắt buộc')
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email }).select('+password')

        if (!user) {
          throw new Error('Email hoặc mật khẩu không đúng')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Email hoặc mật khẩu không đúng')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Xử lý đăng nhập bằng Google
        if (account?.provider === 'google') {
          await dbConnect()

          // Kiểm tra xem user đã tồn tại chưa
          let existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            // Tạo user tạm thời, đánh dấu chưa hoàn tất đăng ký
            const newUser = new User({
              email: user.email,
              name: user.name,
              role: 'user',
              isGoogleRegistrationComplete: false,
            })
            existingUser = await newUser.save({ validateBeforeSave: false })
          }

          // Gắn ID và các thông tin vào object user
          user.id = existingUser._id.toString()
          ;(user as any).role = existingUser.role
          ;(user as any).isGoogleRegistrationComplete = existingUser.isGoogleRegistrationComplete
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.isGoogleRegistrationComplete = (user as any).isGoogleRegistrationComplete
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        (session.user as any).isGoogleRegistrationComplete = token.isGoogleRegistrationComplete as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
})
