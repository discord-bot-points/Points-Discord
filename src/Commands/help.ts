import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Affiche l'aide")

  const helpEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Help')
	.setAuthor({ name: 'THP', iconURL: 'https://i.imgur.com/uG945fE.png', url: 'https://www.thehackingproject.org/' })
	.setDescription("Bot qui sert à envoyer des points à d'autres membres du discord")
  .addFields({ name: '\u2009', value: '\u2009'})
	.addFields(
		{ name: 'Commands', value: 'type `/balance` to see your balance \n type `/send` to open the send options' }
	)
  .addFields({ name: '\u2009', value: '\u2009'})
	.setTimestamp()

  const button = new ButtonBuilder()
	.setLabel('Github')
	.setURL('https://github.com/discord-bot-points/Points-Discord')
	.setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder()
  .addComponents(button)

export async function execute(interaction: CommandInteraction) {
  return interaction.reply({
      embeds: [helpEmbed],
      components: [row],
      ephemeral: true,
    });
  }