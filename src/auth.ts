// Configura la autenticación administrativa mediante email, contraseña cifrada y sesiones seguras.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash =
          process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          return null;
        }

        if (email !== adminEmail) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          adminPasswordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: "admin",
          email: adminEmail,
          name: "Administrador Victorino",
        };
      },
    }),
  ],
});