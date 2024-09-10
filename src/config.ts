import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, LOG_CHANNEL_ID, ADMIN_USER_DISCORD_USERNAME  } = process.env;
const ADMIN_USER_BALANCE = process.env.ADMIN_USER_BALANCE ? parseInt(process.env.ADMIN_USER_BALANCE) : 0;
const ADMIN_USER_POINTS_RECEIVED = process.env.ADMIN_USER_POINTS_RECEIVED ? parseInt(process.env.ADMIN_USER_POINTS_RECEIVED) : 0;
const ADMIN_USER_POINTS_SENT = process.env.ADMIN_USER_POINTS_SENT ? parseInt(process.env.ADMIN_USER_POINTS_SENT) : 0;


if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !LOG_CHANNEL_ID || !ADMIN_USER_DISCORD_USERNAME || !ADMIN_USER_BALANCE || !ADMIN_USER_POINTS_RECEIVED || !ADMIN_USER_POINTS_SENT) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  LOG_CHANNEL_ID,
  ADMIN_USER_DISCORD_USERNAME, 
  ADMIN_USER_BALANCE, 
  ADMIN_USER_POINTS_RECEIVED, 
  ADMIN_USER_POINTS_SENT
};