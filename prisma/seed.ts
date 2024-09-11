import { PrismaClient } from '@prisma/client'
import { config } from "../src/config";

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: config.userData 
  });
  await prisma.domain.createMany({
    data: config.domainData
  })
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