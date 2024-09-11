import { PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

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
    let topUsersEmbed: EmbedBuilder[] = [];
    topUsers.forEach((topUser, index) => {
      // Ajouter des emojis pour les trois premiers utilisateurs
      let emoji = '';
      if (index === 0) emoji = '🥇';
      else if (index === 1) emoji = '🥈';
      else if (index === 2) emoji = '🥉';

      const topUserEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${index + 1}  -  ${topUser.discordUsername}  -  ${topUser.balance} points ${emoji}`,
          iconURL: `${topUser.discordUserAvatar}`
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