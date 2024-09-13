import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Affiche l'aide");

export async function execute(interaction: CommandInteraction) {
  const helpEmbed = new EmbedBuilder()
    .setColor(3050327)
    .setTitle('Help')
    .setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
    .setDescription("Bot qui sert à envoyer des points à d'autres membres du discord")
    .addFields(
      { name: '\u2009', value: '\u2009' },
      { name: 'Commands', value: 'type `/balance` to see your balance \n type `/send` to open the send options \n type `/leaderboard` to see the leaderboard \n type `/public-leaderboard` to see the public leaderboard' },
      { name: '\u2009', value: '\u2009' }
    )
    .setTimestamp();

  const button = new ButtonBuilder()
    .setLabel('Github')
    .setURL('https://github.com/discord-bot-points/Points-Discord')
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(button);

  return interaction.reply({
    embeds: [helpEmbed],
    components: [row],
    ephemeral: true,
  });
}
