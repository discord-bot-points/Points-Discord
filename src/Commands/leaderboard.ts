import { PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

const prisma = new PrismaClient();

interface User {
  discordUserId: String | null; // "| null" to delete if UserId is mandatory
  discordUserAvatar: String | null; // "| null" to delete if UserId is mandatory
  balance: number;
}

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Affiche les top 10 contributeurs")
  

export async function execute(interaction: CommandInteraction) {
  // find users in database and store them in topUsers
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
    

    //methode with 1 embed but many users
    const topUsersEmbed = new EmbedBuilder()
      .setColor(4772300)
      .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
      .setTitle('Leaderboard')
      .setDescription('Top 10 contributeurs :')

    let userEmbed = '';
    let currentPosition = 1;
    //iterate the array to create only 1 embed with many users
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
      
      userEmbed += `\`${currentPosition}\` <@${topUser.discordUserId}> - **${topUser.balance}** points ${emoji} \n`;
    });

    // Adding every user in one field
    topUsersEmbed.addFields({ name: '\u200B', value: userEmbed });

    // Create a button
    const button = new ButtonBuilder()
    .setURL("https://github.com/discord-bot-points/Points-Discord")
    .setLabel('See more details on the web')
    .setStyle(ButtonStyle.Link)
    .setDisabled(false)

    // Adding the button in the ActionRow
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({
      embeds: [topUsersEmbed],
      components: [row],
      ephemeral: true,
    });


  } catch (error) {
    console.error('Erreur lors de la récupération des contributeurs', error);
    await interaction.reply({
      content: "Une erreur s'est produite lors de la récupération des contributeurs",
      ephemeral: true,
    });
  }
}