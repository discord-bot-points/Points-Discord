// deploy-commands.ts
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config } from "./config";
import { fetchDomains } from "./Db/fetch_domain";
import * as help from "./Commands/help";
import * as balance from "./Commands/balance";
import * as ping from "./Commands/ping";
import * as leaderboard from "./Commands/leaderboard";
import * as public_leaderboard from "./Commands/publicLeaderboard";

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

export async function getCommandData() {

  const domains = await fetchDomains();

  const sendCommand = new SlashCommandBuilder()
    .setName("send")
    .setDescription("Envoie des points à un autre utilisateur")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("La personne qui va recevoir les points")
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
        .addChoices(...domains)
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
    
  const helpCommand = help.data;
  const balanceCommand = balance.data;
  const pingCommand = ping.data;
  const leaderboardCommand = leaderboard.data;
  const publicVisibleLeaderboardCommand = public_leaderboard.data

  return [sendCommand, helpCommand, balanceCommand, pingCommand, leaderboardCommand, publicVisibleLeaderboardCommand];
}

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log("Started refreshing application (/) commands.");

    const commandsData = await getCommandData();

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
