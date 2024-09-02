import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      discordUsername: "Evarella",
      balance: 4500,
      pointsReceived: 5000,
      pointsSent: 500,
      sent: {
        create: {
          points: 500,
          description: "test",
          link: "www.lalala.com",
          receiverId: "Ithara",
          domainId: "Dev"
        }
      }

    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })