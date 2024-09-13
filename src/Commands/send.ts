import { PrismaClient, User, Domain, Transaction } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder } from "discord.js";
import { config } from "../config";

const prisma = new PrismaClient();

function getColor(points: number) {
  if (points >= 100 && points < 200) {
    return '#1EFF00'; // Vert
  } else if (points >= 200 && points < 500) {
    return '#0070DD'; // Bleu
  } else if (points >= 500 && points < 1000) {
    return '#8A2BE2'; // Violet
  } else if (points >= 1000) {
    return '#FF8000'; // Orange
  } else {
    return '#FFFAFA'; // Blanc
  }
}
export async function execute(interaction: CommandInteraction) {
  const targetUser = interaction.options.getUser('user');
  if (!targetUser) {
    return interaction.reply({ content: 'User not found', ephemeral: true });
  }
  const receiverUsername = targetUser.username;
  const receiverUserId = targetUser.id;
  const receiverUserAvatarURL = targetUser.displayAvatarURL({ extension: 'webp', size: 128 });
  const points = interaction.options.getInteger('points');
  const domain = interaction.options.getString('domain');
  const description = interaction.options.getString('description');
  const link = interaction.options.getString('link') ?? '';
  const usage = interaction.options.getString('transaction');
  const senderUsername = interaction.user.username;
  const senderUserId = interaction.user.id;
  const senderUserAvatarURL = interaction.user.displayAvatarURL({ extension: 'webp', size: 128 });
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

    //verify users avatar in the database, if not up to date then update
    if(sender && sender.discordUserAvatar !== senderUserAvatarURL){
      sender = await prisma.user.update({
        where: { discordUsername: senderUsername },
        data: {
          discordUserAvatar: senderUserAvatarURL,
        },
      });
    };

    if(receiver && receiver.discordUserAvatar !== receiverUserAvatarURL){
      receiver = await prisma.user.update({
        where: { discordUsername: receiverUsername },
        data: {
          discordUserAvatar: receiverUserAvatarURL,
        },
      });
    };

    if (!sender) {
      console.log("Utilisateur non trouvé, création...");
      sender = await prisma.user.create({
        data: {
          discordUsername: senderUsername,
          discordUserId: senderUserId,
          discordUserAvatar: senderUserAvatarURL,
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
          discordUserId: receiverUserId,
          discordUserAvatar: receiverUserAvatarURL,
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

    if (points > sender.balance) {
      await interaction.reply({
        content: "Vous n'avez pas assez de points pour envoyer ces points",
        ephemeral: true,
      });
      return;
    }

    const senderOldBalance = sender.balance;
    const receiverOldBalance = receiver.balance;

    const updatedSender = await prisma.user.update({
      where: { discordUsername: senderUsername },
      data: {
        balance: { decrement: points },
        pointsSent: { increment: points }
      },
    });
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
        personalUsage: usage === "Perso" ? true : false,
        toRepay: usage === "Perso" ? false : true
      },
    });
    
    const color = getColor(points);

    const tradeEmbed = new EmbedBuilder()
    .setColor(12632256)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `${domainPick.name}`, value: `<@${senderUser.id}> a envoyé ${points} points à <@${targetUser.id}>` },
      { name: '\u2009', value: '\u2009' },
      ...(description ? [{ name: 'Description', value: description }] : []),
      { name: '\u2009', value: '\u2009' },
      ...(link ? [{ name: 'Link', value: link }] : [])
    )
    .addFields({ name: '\u2009', value: '\u2009' })
    .setTimestamp();

    const updatedBalanceEmbed = new EmbedBuilder()
    .setColor(4772300)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `Your balance`, value: `~~${senderOldBalance} points~~  > ${updatedSender?.balance} points` },
      { name: '\u2009', value: '\u2009' },
      { name: `${targetUser.globalName}'s balance`, value: `~~${receiverOldBalance} points~~ > ${updatedReceiver?.balance} points` }
    )
    .addFields({ name: '\u2009', value: '\u2009' })
    .setTimestamp();

    const logsEmbed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `${domainPick.name}`, value: `<@${senderUser.id}> a envoyé ${points} points à <@${targetUser.id}>` },
      { name: '\u2009', value: '\u2009' },
      ...(description ? [{ name: 'Description', value: description }] : []),
      { name: '\u2009', value: '\u2009' },
      ...(link ? [{ name: 'Link', value: link }] : [])
    )
    .addFields({ name: '\u2009', value: '\u2009' })
    .setTimestamp();
    
    await interaction.reply({
      embeds: [tradeEmbed]
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
