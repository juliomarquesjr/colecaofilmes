import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Função para criar o usuário admin inicial
async function createInitialAdminUser() {
  const existingUser = await prisma.user.findFirst();
  if (!existingUser) {
    const hashedPassword = await hash("admin", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        name: "Admin",
        phone: "admin",
        address: "admin",
        password: hashedPassword,
        isAdmin: true
      }
    });
    console.log("Usuário admin inicial criado com sucesso");
  }
}

// Criar usuário admin inicial
createInitialAdminUser();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Nome de Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
            deletedAt: null
          }
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Senha incorreta");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          username: user.username,
          isAdmin: user.isAdmin
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 dias
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.sub!,
          name: token.name || "Usuário",
          username: token.username as string,
          isAdmin: token.isAdmin as boolean
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    }
  }
});

export { handler as GET, handler as POST };
