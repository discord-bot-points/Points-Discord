import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchDomains() {
  try {
    const domains = await prisma.domain.findMany();
    return domains.map(domain => ({
      name: domain.name,
      value: domain.name, // Utiliser une valeur unique pour chaque domaine
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des domaines", error);
    throw error;
  }
}