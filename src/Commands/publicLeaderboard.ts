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
        { discordUsername: 'asc' } // secondary sorting criteria
      ],
      take: 10,
    });

    //if there is no user in the database
    if (topUsers.length === 0) {
      await interaction.reply({
        content: "Il n'y a aucun utilisateur dans la base de données.",
        ephemeral: true,
      });
      return;
    }
    

    // Method with many embeds
    let topUsersEmbed: EmbedBuilder[] = [];
    let currentPosition = 1;
    //iterate the array to create 1 embed for each user
    topUsers.forEach((topUser, index) => {
      
      // determinate the position of each user
      if (index > 0 && topUser.balance < topUsers[index - 1].balance) {
        currentPosition = index + 1;
      }

      // Adding emojis only on the 3 first positions
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

    // Create a button
    const button = new ButtonBuilder()
    .setURL("https://github.com/discord-bot-points/Points-Discord")
    .setLabel('See more details on the web')
    .setStyle(ButtonStyle.Link)
    .setDisabled(false)

    // Adding the button in the ActionRow
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    // Reply to interaction with text and embeds
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