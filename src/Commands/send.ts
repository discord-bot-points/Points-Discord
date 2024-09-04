import { Prisma, PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const prisma = new PrismaClient();

export const data = new SlashCommandBuilder()
  .setName("send")
  .setDescription("Envoie des points à un autre utilisateur")
  .addUserOption(option =>
    option.setName("user")
    .setDescription("la personne qui va recevoir les points")
    .setRequired(true)
  )
  .addNumberOption(option =>
    option.setName("points")
    .setDescription("Le nombre de points que vous voulez envoyer")
    .setRequired(true)
  )
  .addStringOption(option =>
    option.setName("domain")
    .setDescription("Le domaine de la transaction")
    .setRequired(true)
  )
  .addStringOption(option =>
    option.setName("description")
    .setDescription("La description de la transaction")
    .setRequired(false)
  )
  .addStringOption(option =>
    option.setName("link")
    .setDescription("Lien de la transaction")
    .setRequired(false)
  )

  export async function execute(interaction: CommandInteraction) {
    const targetUser = interaction.options.getUser('user');
    const receiverUsername = targetUser.username;
    const points = interaction.options.getNumber('points');
    const domain = interaction.options.getString('domain');
    const description = interaction.options.getString('description')?.toString();
    const link = interaction.options.getString('link')?.toString();
    const senderUsername = interaction.user.username;

    try {
      let sender = await prisma.user.findUnique({
        where: { discordUsername: senderUsername}
      });
      let receiver = await prisma.user.findUnique({
        where: { discordUsername: receiverUsername}
      });
      const domainList = await prisma.domain.findMany();
      const domainId = domainList.map(domain => domain.name);

      if (!sender) {
        console.log("User non trouvé", "création...")
        sender = await prisma.user.create({
          data: {
            discordUsername: senderUsername,
            balance: 0,
            pointsSent: 0,
            pointsReceived: 0,
          },
        });
        console.log("Utilisateur créé", sender)
      }

      if (!receiver) {
        console.log("User non trouvé", "création...")
        receiver = await prisma.user.create({
          data: {
            discordUsername: receiverUsername,
            balance: 0,
            pointsSent: 0,
            pointsReceived: 0,
          },
        });
        console.log("Utilisateur créé", receiver)
      }

      if (points > sender.balance) {
        await interaction.reply({
          content: "Vous n'avez pas assez de points pour envoyer ces points",
          ephemeral: true,
        });
        return;
      }

      await prisma.user.update({
        where: { discordUsername: senderUsername },
        data: { 
          balance: { decrement: points },
          pointsSent: { increment: points } 
        },
      });
      await prisma.user.update({
        where: { discordUsername: receiverUsername },
        data: { 
          balance: { increment: points }, 
          pointsReceived: { increment: points }},
      });

      await prisma.transaction.create({
        data: {
          points: points,
          description: description,
          link: link,
          senderId: senderUsername,
          receiverId: receiverUsername,
          domainId: domainExists.name,
        },
      });

      await interaction.reply({
        content: `Vous avez envoyé ${points} points à ${receiverUsername}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la transaction', error);
      await interaction.reply({
        content: "Une erreur s'est produite lors de l'envoi de la transaction",
        ephemeral: true,
      });
    }
  }
