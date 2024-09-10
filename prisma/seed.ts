import { PrismaClient } from '@prisma/client'
import { config } from "../src/config";

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      discordUsername: config.ADMIN_USER_DISCORD_USERNAME,
      balance: config.ADMIN_USER_BALANCE,
      pointsReceived: config.ADMIN_USER_POINTS_RECEIVED,
      pointsSent: config.ADMIN_USER_POINTS_SENT,
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