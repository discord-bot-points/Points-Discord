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
  const testUser = "1143626021808124019";
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
    
    //methode avec 1 embed mais plusieur user
    // const topUsersEmbed = new EmbedBuilder()
    //   .setColor(4772300)
    //   .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    //   .setTitle('Leaderboard')
    //   .setDescription('Top 10 contributeurs :')

    //   let userEmbed = '';
    //   topUsers.forEach((topUser, index) => {
    //     const position = `${index + 1}`; // Index aligné à gauche
    //     const username = `<@${testUser}>`; // Tag de l'utilisateur au milieu
    //     const balance = `**${topUser.balance}** points`; // Balance alignée à droite
      
    //     // Ajouter des emojis pour les trois premiers utilisateurs
    //     let emoji = '';
    //     if (index === 0) emoji = '🥇';
    //     else if (index === 1) emoji = '🥈';
    //     else if (index === 2) emoji = '🥉';

    //     userEmbed += `\`${position}\` ${username} - ${balance} ${emoji} \n`;
    //   });
      
    //   // Ajouter tous les utilisateurs dans un seul champ
    //   topUsersEmbed.addFields({ name: '\u200B', value: userEmbed });
    
    // await interaction.reply({
    //   embeds: [topUsersEmbed],
    //   ephemeral: true,
    // });

    // Méthode avec plusieurs embeds
    // @ts-ignore
    let topUsersEmbed = [];
    topUsers.forEach((topUser, index) => {
      let emoji = '';
      if (index === 0) emoji = '🥇';
      else if (index === 1) emoji = '🥈';
      else if (index === 2) emoji = '🥉';

      const topUserEmbed = new EmbedBuilder()
        .setDescription(`${emoji} ${index + 1} - **${topUser.discordUsername}** - <@${testUser}> - **${topUser.balance} points**`);
      topUsersEmbed.push(topUserEmbed);
    });

    // Répondre à l'interaction avec le texte et les embeds
    await interaction.reply({
      content: "Top 10 contributeurs :",
      // @ts-ignore
      embeds: topUsersEmbed,
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