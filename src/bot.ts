import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./Commands";
import { config } from "./config";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖");
  const guilds = client.guilds.cache.map(guild => guild.id)
  for(const guildId of guilds) {
  await deployCommands({ guildId})};
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);

