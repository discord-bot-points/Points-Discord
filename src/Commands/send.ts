import { PrismaClient, User, Domain, Transaction } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder, TextChannel, EmbedBuilder } from "discord.js";

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
  );

function getColor(points: number) {
  if (points < 100) {
    return 32768;
  } else if (points >= 100 && points < 200) {
    return 52945;
  } else if (points >= 200 && points < 500) {
    return 16766720;
  } else if (points >= 500 && points < 1000) {
    return 16753920;
  } else if (points > 1000) {
    return 16711680;
  } else {
    return 32768;
  }
}
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

    console.log('targetUser', targetUser)

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
      },
    });
    
    const color = getColor(points);

    const tradeEmbed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: `${domainPick.name}`, value: `<@${senderUser.id}> a envoyé ${points} points à <@${targetUser.id}>` },
      { name: '\u2009', value: '\u2009' }
    )
    .setTimestamp();

    const updatedBalanceEmbed = new EmbedBuilder()
    .setColor(color)
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
      { name: '\u2009', value: '\u2009' }
    )
    .setTimestamp();


    await interaction.reply({
      embeds: [tradeEmbed],
    });

    await interaction.followUp({
      embeds: [updatedBalanceEmbed],
      ephemeral: true,
    })

    const channelId = '1280461035802984519'
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
