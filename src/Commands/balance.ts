import { Prisma, PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

const prisma = new PrismaClient();

export const data = new SlashCommandBuilder()
  .setName("balance")
  .setDescription("Affiche ta balance de points")
  .addUserOption(option =>
    option.setName("user")
    .setDescription("Voir les points de cet utilisateur")
    .setRequired(false)
  )
  
export async function execute(interaction: CommandInteraction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const discordUsername = targetUser.username.toLowerCase();

  try {
    let user = await prisma.user.findUnique({
      where: { discordUsername: discordUsername}
    });
    console.log("User trouvé", user)
    if (!user) {
      console.log("User non trouvé", "création...")
      user = await prisma.user.create({
        data: {
          discordUsername: discordUsername,
          balance: 0,
          pointsSent: 0,
          pointsReceived: 0,
        },
      });
      console.log("Utilisateur créé", user)
    }

    const balanceEmbed = new EmbedBuilder()
    .setColor(4772300)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `Balance de ${targetUser.globalName}`, value: `La balance actuelle de <@${targetUser.id}> est de ${user.balance} points` },
      { name: '\u2009', value: '\u2009' }
    )
    .setTimestamp();

  await interaction.reply({
    embeds: [balanceEmbed],
    ephemeral: true,
  });

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance', error);
    await interaction.reply({
      content: "Une erreur s'est produite lors de la récupération de votre balance",
      ephemeral: true,
    });
  }
}