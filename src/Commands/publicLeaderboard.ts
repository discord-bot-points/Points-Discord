import { PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

const prisma = new PrismaClient();

interface User {
  discordUsername: string;
  discordUserId: string | null; // "| null" to delete if UserId is mandatory
  discordUserAvatar: string | null; // "| null"to delete if UserId is mandatory
  balance: number;
}

export const data = new SlashCommandBuilder()
  .setName("public_leaderboard")
  .setDescription("Affiche les top 10 contributeurs")
  

export async function execute(interaction: CommandInteraction) {

  try {
    const topUsers: User[] = await prisma.user.findMany({
      orderBy: [
        { balance: 'desc' },
        { discordUsername: 'asc' } // Critère de tri secondaire
      ],
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
    let topUsersEmbed: EmbedBuilder[] = [];
    let currentPosition = 1;
    topUsers.forEach((topUser, index) => {
      
      // Déterminer la position
      if (index > 0 && topUser.balance < topUsers[index - 1].balance) {
        currentPosition = index + 1;
      }

      // Ajouter des emojis pour les trois premiers utilisateurs
      let emoji = '';
      if (currentPosition === 1) emoji = '🥇';
      else if (currentPosition === 2) emoji = '🥈';
      else if (currentPosition === 3) emoji = '🥉';

      const topUserEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${currentPosition}  -  ${topUser.discordUsername}  -  ${topUser.balance} points ${emoji}`,
          iconURL: topUser.discordUserAvatar || 'https://www.thehackingproject.org/assets/favicon/favicon-32x32-804b12d1c41c60fe721477b7c3b0a32811dc610580dd40ac92f1cc04cbd05ca4.png' //use default image if the user has no avatar store in the database
        })
      topUsersEmbed.push(topUserEmbed);
    });

    // Créer un bouton
    const button = new ButtonBuilder()
    .setURL("https://github.com/discord-bot-points/Points-Discord")
    .setLabel('See more details on the web')
    .setStyle(ButtonStyle.Link)
    .setDisabled(false)

    // Ajouter le bouton à un ActionRow
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    // Répondre à l'interaction avec le texte et les embeds
    await interaction.reply({
      content: "Top 10 contributeurs :",
      embeds: topUsersEmbed,
      components: [row],
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