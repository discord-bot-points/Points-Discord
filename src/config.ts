import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, LOG_CHANNEL_ID, ADMIN_USER_DISCORD_USERNAME, ADMIN_USER_2_DISCORD_USERNAME, ADMIN_USER_BALANCE, ADMIN_USER_POINTS_SENT, ADMIN_USER_POINTS_RECEIVED, ADMIN_USER_2_BALANCE, ADMIN_USER_2_POINTS_SENT, ADMIN_USER_2_POINTS_RECEIVED, DOMAIN_1, DOMAIN_2, DOMAIN_3, ADMIN_USER_DISCORD_ID, ADMIN_USER_DISCORD_AVATAR, ADMIN_USER_2_DISCORD_ID, ADMIN_USER_2_DISCORD_AVATAR  } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !LOG_CHANNEL_ID || !ADMIN_USER_DISCORD_USERNAME || !ADMIN_USER_BALANCE || !ADMIN_USER_POINTS_SENT || !ADMIN_USER_POINTS_RECEIVED || !ADMIN_USER_2_DISCORD_USERNAME || !ADMIN_USER_2_BALANCE || !ADMIN_USER_2_POINTS_SENT || !ADMIN_USER_2_POINTS_RECEIVED || !DOMAIN_1 || !DOMAIN_2 || !DOMAIN_3 || !ADMIN_USER_DISCORD_ID || !ADMIN_USER_DISCORD_AVATAR || !ADMIN_USER_2_DISCORD_ID || !ADMIN_USER_2_DISCORD_AVATAR) {
  throw new Error("Missing environment variables");
}

const userData = [
  { 
    discordUsername: ADMIN_USER_DISCORD_USERNAME, 
    discordUserId: ADMIN_USER_DISCORD_ID,
    discordUserAvatar: ADMIN_USER_DISCORD_AVATAR,
    balance: parseInt(process.env.ADMIN_USER_BALANCE || "0"), 
    pointsSent: parseInt(process.env.ADMIN_USER_POINTS_SENT || "0"), 
    pointsReceived: parseInt(process.env.ADMIN_USER_POINTS_RECEIVED || "0")
  },
  { 
    discordUsername: ADMIN_USER_2_DISCORD_USERNAME, 
    discordUserId: ADMIN_USER_2_DISCORD_ID,
    discordUserAvatar: ADMIN_USER_2_DISCORD_AVATAR,
    balance: parseInt(process.env.ADMIN_USER_2_BALANCE || "0"), 
    pointsSent: parseInt(process.env.ADMIN_USER_2_POINTS_SENT || "0"), 
    pointsReceived: parseInt(process.env.ADMIN_USER_2_POINTS_RECEIVED || "0") 
  }
]

const domainData = [
  { name: DOMAIN_1 },
  { name: DOMAIN_2 },
  { name: DOMAIN_3 }
]

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  LOG_CHANNEL_ID,
  userData,
  domainData
};