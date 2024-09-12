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
    

    //methode avec 1 embed mais plusieur user
    const topUsersEmbed = new EmbedBuilder()
      .setColor(4772300)
      .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
      .setTitle('Leaderboard')
      .setDescription('Top 10 contributeurs :')

    let userEmbed = '';
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

      userEmbed += `\`${currentPosition}\` <@${topUser.discordUserId}> - **${topUser.balance}** points ${emoji} \n`;
    });
      
    // Ajouter tous les utilisateurs dans un seul champ
    topUsersEmbed.addFields({ name: '\u200B', value: userEmbed });
    
    // Créer un bouton
    const button = new ButtonBuilder()
    .setURL("https://github.com/discord-bot-points/Points-Discord")
    .setLabel('See more details on the web')
    .setStyle(ButtonStyle.Link)
    .setDisabled(false)

    // Ajouter le bouton à un ActionRow
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