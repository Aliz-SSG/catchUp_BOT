const { Api } = require("telegram");      
const logger = require("../utils/logger"); 

async function findChatByName(client, chatName) {
try{
    const dialogs = await client.getDialogs();
    const chat = dialogs.find(d =>
        d.name.toLowerCase().includes(chatName.toLowerCase())
    );

    if (chat) return chat.entity; 
    return null;    
}
catch (err) {
        logger?.error("Error fetching messages:", err);
        return [];        
};}
async function formatMessage(message) {
    const sender = message.sender?.firstName || message.sender?.username || "Unknown";
try{
   
    let text = "";
    if (message.message && message.message.trim()) {
        text = message.message;
    } else if (message.voice || message.audio) {
        text = "🎤 Voice message";
    } else if (message.video) {
        text = "🎥 Video message";
    } else if (message.gif || (message.media && message.media.document?.mimeType?.includes('gif'))) {
        text = "🎞️ GIF";
    } else if (message.sticker) {
        text = "💠 Sticker";
    } else if (message.photo) {
        text = "📷 Photo";
    } else if (message.document) {
        text = "📎 File";
    } else if (message.poll) {
        text = "📊 Poll";
    } else {
        text = "💬 Unsupported message type";
    }

    return `${sender}: ${text}`;
}
catch (err) {
        logger?.error("Error fetching messages:", err);
        return [];
};}


async function fetchRecentMessages(client, chatName, limit = 50) {
try{
    const chat = await findChatByName(client, chatName);
    if (!chat) {
        logger?.error(`Chat "${chatName}" not found.`);
        return [];
    }

    const messages = await client.getMessages(chat, { limit });

    const formatted = messages.map(msg => formatMessage(msg));

    return formatted.reverse();
}
catch (err) {
        logger?.error("Error fetching messages:", err);
        return [];
};}

module.exports = { fetchRecentMessages };
