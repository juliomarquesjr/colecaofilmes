import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Tratamento de reconexão
prisma.$connect()
  .then(() => {
    console.log('Conectado ao banco de dados com sucesso')
  })
  .catch((error: Error) => {
    console.error('Erro ao conectar com o banco de dados:', error)
    process.exit(1)
  })

// Tratamento de desconexão
process.on('beforeExit', () => {
  void prisma.$disconnect()
}) 