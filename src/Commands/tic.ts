import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("tic")
  .setDescription("Replies with tac!");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("tac!");
}