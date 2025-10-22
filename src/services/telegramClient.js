const fs = require("fs");
const path = require("path");
const config = require("../config/telegram.config");
const logger = require("../utils/logger");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
require("dotenv").config();

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;

const rawSessionPath = config.sessionPath || "./session.session";
let sessionFilePath = rawSessionPath;
let sessionData = null;

try {
    if (fs.existsSync(rawSessionPath)) {
        const stats = fs.statSync(rawSessionPath);
        if (stats.isDirectory()) {
  
            sessionFilePath = path.join(rawSessionPath, "session.session");
        }
    } else {
 
        const parent = path.dirname(rawSessionPath);
        if (parent && parent !== "." && !fs.existsSync(parent)) {
            fs.mkdirSync(parent, { recursive: true });
        }
    }

    if (fs.existsSync(sessionFilePath) && fs.statSync(sessionFilePath).isFile()) {
        sessionData = fs.readFileSync(sessionFilePath, "utf-8");
    } else {
        sessionData = null;
        logger.info(`Telegram session file not found at ${sessionFilePath}. Starting without existing session.`);
    }
} catch (err) {
    logger.error("Error reading Telegram session file:", err);
    sessionData = null;
}

const sessionDir = path.join(__dirname, "../../data/sessions");
const sessionFile = path.join(sessionDir, "telegram.session");

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

const client = new TelegramClient(new StringSession(sessionData || ""), apiId, apiHash, {
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
