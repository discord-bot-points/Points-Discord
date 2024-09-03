import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("pouet")
  .setDescription("Replies with pouet!");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("pouet!");
}