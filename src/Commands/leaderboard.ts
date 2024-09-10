import { PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

const prisma = new PrismaClient();

interface User {
  discordUsername: string;
  balance: number;
}

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Affiche les top 10 contributeurs")
  

export async function execute(interaction: CommandInteraction) {

  try {
    const topUsers: User[] = await prisma.user.findMany({
      orderBy: {
        balance: 'desc',
      },
      take: 10,
    });
    console.log("Users trouvé", topUsers)

    //s'il n'y a aucun user dans la database
    if (topUsers.length === 0) {
      await interaction.reply({
        content: "Il n'y a aucun utilisateur dans la base de données.",
        ephemeral: true,
      });
      return;
    }
    
    const topUsersEmbed = new EmbedBuilder()
      .setColor(4772300)
      .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
      .setTitle('Leaderboard')
      .setDescription('Top 10 contributeurs :')
      .setTimestamp();

      let userEmbed = '';
      topUsers.forEach((topUser, index) => {
        const position = `${index + 1}`.padEnd(4, ' '); // Index aligné à gauche
        const username = `<@${topUser.discordUsername}>`.padEnd(20, ' '); // Tag de l'utilisateur au milieu
        const balance = `${topUser.balance} points`.padStart(10, ' '); // Balance alignée à droite
      
        userEmbed += `\`${position} ${username} ${balance}\`\n`;
      });
      
      // Ajouter tous les utilisateurs dans un seul champ
      topUsersEmbed.addFields({ name: '\u200B', value: userEmbed });
      
    // 1 embed avec tous les users
    // topUsers.forEach((topUser, index) => {
    //   const position = `${index + 1}`.padEnd(4, ' '); // Index aligné à gauche
    //   const username = topUser.discordUsername.padEnd(20, ' '); // Nom d'utilisateur au milieu
    //   const balance = `${topUser.balance} points`.padStart(10, ' '); // Balance alignée à droite
    
    //   topUsersEmbed.addFields(
    //     { name: '\u200B', value: `\`${position} ${username} ${balance}\`` }
    //   );
    // });
      

  await interaction.reply({
    embeds: [topUsersEmbed],
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