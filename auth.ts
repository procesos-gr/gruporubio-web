import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // En Fase 0 devolvemos null o un mock para cumplir validación
        // En próximas fases aquí validaremos contra Prisma CustomerAccount
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // TODO Fase 2: validar contra Prisma CustomerAccount con bcrypt
        return null;
      }
    })
  ],
  pages: {
    // Aquí pondremos /login cuando tengamos la página con locale
    // signIn: '/login'
  },
  session: {
    strategy: "jwt",
  },
});
