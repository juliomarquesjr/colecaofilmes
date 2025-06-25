import { PrismaClient } from '../generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Tratamento de erro de conexão
prisma.$connect()
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error)
    process.exit(1)
  }) 