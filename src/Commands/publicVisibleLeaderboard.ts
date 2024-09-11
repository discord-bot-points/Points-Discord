import { PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

const prisma = new PrismaClient();

interface User {
  discordUsername: string;
  discordUserId: String | null; // "| null" to delete if UserId is mandatory
  discordUserAvatar: String | null; // "| null"to delete if UserId is mandatory
  balance: number;
}

export const data = new SlashCommandBuilder()
  .setName("public_visible_leaderboard")
  .setDescription("Affiche les top 10 contributeurs")
  

export async function execute(interaction: CommandInteraction) {

  try {
    const topUsers: User[] = await prisma.user.findMany({
      orderBy: {
        balance: 'desc',
      },
      take: 10,
    });
    // console.log("Users trouvé", topUsers)

    //s'il n'y a aucun user dans la database
    if (topUsers.length === 0) {
      await interaction.reply({
        content: "Il n'y a aucun utilisateur dans la base de données.",
        ephemeral: true,
      });
      return;
    }
    

    // Méthode avec plusieurs embeds
    // @ts-ignore
    let topUsersEmbed = [];
    topUsers.forEach((topUser, index) => {
      const topUserEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${index + 1}  -  ${topUser.discordUsername}  -  ${topUser.balance} points`,
          iconURL: `${topUser.discordUserAvatar}`
        })
      topUsersEmbed.push(topUserEmbed);
    });

    // Répondre à l'interaction avec le texte et les embeds
    await interaction.reply({
      content: "Top 10 contributeurs :",
      // @ts-ignore
      embeds: topUsersEmbed,
      ephemeral: false,
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des contributeurs', error);
    await interaction.reply({
      content: "Une erreur s'est produite lors de la récupération des contributeurs",
      ephemeral: true,
    });
  }
}