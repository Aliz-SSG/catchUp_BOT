const fs = require("fs");
const path = require("path");
const input = require("input");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
require("dotenv").config();

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

const sessionDir = path.join(__dirname, "../../data/sessions");
const sessionFile = path.join(sessionDir, "telegram.session");

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

const sessionString = fs.existsSync(sessionFile)
  ? fs.readFileSync(sessionFile, "utf8")
  : "";

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
  connectionRetries: 5,
});

async function connectTelegram() {
  console.log("Connecting to Telegram...");

  await client.start({
    phoneNumber: async () => await input.text("Enter your phone number: "),
    password: async () => await input.text("Enter your 2FA password (if any): "),
    phoneCode: async () => await input.text("Enter the code you received: "),
    onError: (err) => console.error("Login error:", err),
  });

  console.log("✅ Telegram client connected!");


  const stringSession = client.session.save();
  fs.writeFileSync(sessionFile, stringSession, "utf8");
  console.log("💾 Session saved to", sessionFile);
  return client;
}

module.exports = { client, connectTelegram };
