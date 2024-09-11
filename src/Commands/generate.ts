import { PrismaClient, User, Domain, Transaction } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder } from "discord.js";
import { config } from "../config";

const prisma = new PrismaClient();

export async function execute(interaction: CommandInteraction) {
  const targetUser = interaction.options.getUser('user');
  const receiverUsername = targetUser.username;
  const points = interaction.options.getNumber('points');
  const domain = interaction.options.getString('domain');
  const description = interaction.options.getString('description') ?? '';
  const link = interaction.options.getString('link') ?? '';
  const senderUsername = interaction.user.username;
  const senderUser = interaction.user;
  const domains = await prisma.domain.findMany();
  const domainsList = domains.map(domain => domain.name).join(', ');
  
  try {
    let sender = await prisma.user.findUnique({
      where: { discordUsername: senderUsername }
    });
    let receiver = await prisma.user.findUnique({
      where: { discordUsername: receiverUsername }
    });

    const domainPick = await prisma.domain.findUnique({
      where: { name: domain }
    });

    if (!sender) {
      console.log("Utilisateur non trouvé, création...");
      sender = await prisma.user.create({
        data: {
          discordUsername: senderUsername,
          balance: 0,
          pointsSent: 0,
          pointsReceived: 0,
        },
      });
      console.log("Utilisateur créé", sender);
    }

    if (!receiver) {
      console.log("Utilisateur non trouvé, création...");
      receiver = await prisma.user.create({
        data: {
          discordUsername: receiverUsername,
          balance: 0,
          pointsSent: 0,
          pointsReceived: 0,
        },
      });
      console.log("Utilisateur créé", receiver);
    }

    if (!domainPick) {
      await interaction.reply({
        content: `Domaine inexistant. Voici la liste des domaines disponibles : ${domainsList}`,
        ephemeral: true
      });
      return;
    }

    const receiverOldBalance = receiver.balance;

    const updatedReceiver = await prisma.user.update({
      where: { discordUsername: receiverUsername },
      data: {
        balance: { increment: points },
        pointsReceived: { increment: points }
      },
    });

    await prisma.transaction.create({
      data: {
        senderId: sender.discordUsername,
        receiverId: receiver.discordUsername,
        points: points,
        description: description,
        link: link,
        domainId: domainPick.name,
      },
    });

    const generateEmbed = new EmbedBuilder()
    .setColor(16766720)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .setThumbnail('https://i.imgur.com/tI6Hu3V.png')
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `${domainPick.name}`, value: `<@${senderUser.id}> a envoyé ${points} points à <@${targetUser.id}>` },
      { name: '\u2009', value: '\u2009' },
      ...(description ? [{ name: 'Description', value: description }] : []),
      { name: '\u2009', value: '\u2009' },
      ...(link ? [{ name: 'Link', value: link }] : [])
    )
    .addFields({ name: '\u2009', value: '\u2009' })
    .setTimestamp()
    .setFooter({ text: 'Généré' });

    const updatedBalanceEmbed = new EmbedBuilder()
    .setColor(4772300)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `${targetUser.globalName}'s balance`, value: `~~${receiverOldBalance} points~~ > ${updatedReceiver?.balance} points` }
    )
    .addFields({ name: '\u2009', value: '\u2009' })
    .setTimestamp();

    const logsEmbed = new EmbedBuilder()
    .setColor(16766720)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .setThumbnail('https://i.imgur.com/tI6Hu3V.png')
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `${domainPick.name}`, value: `<@${senderUser.id}> a envoyé ${points} points à <@${targetUser.id}>` },
      { name: '\u2009', value: '\u2009' },
      ...(description ? [{ name: 'Description', value: description }] : []),
      { name: '\u2009', value: '\u2009' },
      ...(link ? [{ name: 'Link', value: link }] : [])
    )
    .addFields({ name: '\u2009', value: '\u2009' })
    .setTimestamp()
    .setFooter({ text: 'Généré' });

    await interaction.reply({
      embeds: [generateEmbed]
    });
    await interaction.followUp({
      embeds: [updatedBalanceEmbed],
      ephemeral: true,
    })
    
    const channelId = config.LOG_CHANNEL_ID;
    if (!channelId) {
      console.error("Le canal n'existe pas");
      return;
    }
    const channel = interaction.guild?.channels.cache.get(channelId) as TextChannel;

    if (channel) {
      await channel.send({ embeds: [logsEmbed] });
    } else {
      console.error("Le canal n'existe pas");
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la transaction', error);
    await interaction.reply({
      content: "Une erreur s'est produite lors de l'envoi de la transaction",
      ephemeral: true,
    });
  }
}
