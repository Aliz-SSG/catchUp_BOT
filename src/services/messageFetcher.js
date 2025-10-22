const { Api } = require("telegram");      
const logger = require("../utils/logger"); 

function normalize(s) {
    return String(s || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') 
        .trim();
}

function levenshtein(a, b) {
    if (!a) return b?.length || 0;
    if (!b) return a.length;
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[m][n];
}

async function findChatByName(client, chatName) {
    if (!client || !chatName) return null;
    const wanted = normalize(chatName);
    try {
        const limit = 1000;
        const dialogs = await client.getDialogs({ limit });

        const entries = dialogs.map(d => {
            const title = d.title || d.name || d.entity?.title || d.entity?.username || d.entity?.firstName || '';
            return {
                rawTitle: title,
                normalized: normalize(title),
                entity: d.entity || d,
                id: d.id || d.entity?.id || null,
                username: d.entity?.username || null
            };
        });


        for (const e of entries) {
            if (!e.normalized) continue;
            if (e.normalized === wanted || e.normalized.includes(wanted) || wanted.includes(e.normalized)) {
                logger.debug(`findChatByName: matched dialog "${e.rawTitle}" (id=${e.id}) for input "${chatName}"`);
                return e.entity;
            }
        }

   
        if (chatName.startsWith('@')) {
            try {
                const ent = await client.getEntity(chatName);
                if (ent) {
                    logger.debug(`findChatByName: getEntity resolved ${chatName}`);
                    return ent;
                }
            } catch (innerErr) {
                logger.debug(`findChatByName: getEntity(${chatName}) failed: ${innerErr?.message || innerErr}`);
            }
        } else {
    
            try {
                const ent = await client.getEntity('@' + chatName);
                if (ent) {
                    logger.debug(`findChatByName: getEntity resolved @${chatName}`);
                    return ent;
                }
            } catch (innerErr) {
             
            }
        }

        const scored = entries
            .filter(e => e.normalized)
            .map(e => ({ e, score: levenshtein(wanted, e.normalized) }))
            .sort((a, b) => a.score - b.score)
            .slice(0, 8)
            .map(s => ({ title: s.e.rawTitle, normalized: s.e.normalized, username: s.e.username, id: s.e.id, score: s.score }));

        logger.error("Error finding chat: no dialog matched.");
        logger.error(`Searched for "${chatName}" (normalized="${wanted}"). Dialog count: ${entries.length}. Top suggestions:`);
        for (const s of scored) {
            logger.error(` - "${s.title}" (normalized="${s.normalized}", username="${s.username}", id=${s.id}) score=${s.score}`);
        }

        return null;
    } catch (err) {
        logger.error("Error finding chat:", err?.stack || err);
        return null;
    }
}

async function formatMessage(message) {
    const sender = (message.sender?.firstName) || (message.sender?.username) || "Unknown";
    try {
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
        

        return { text: `${sender}: ${text}`, original: message };
    } catch (err) {
        logger.error("Error formatting message:", err);
        return { text: `${sender}: 💬 Error reading message`, original: message };
    }
}

async function fetchMessages(client, chatName, limit = 50) {
    try {
        if (!client) {
            logger.error("No Telegram client provided to fetchMessages.");
            return [];
        }

        const chat = await findChatByName(client, chatName);
        if (!chat) {
            logger.error(`Chat "${chatName}" not found.`);
            return [];
        }

        const messages = await client.getMessages(chat, { limit });

      
        const formatted = await Promise.all(messages.map(msg => formatMessage(msg)));

        return formatted.reverse();
    } catch (err) {
        logger.error("Error fetching messages:", err);
        return [];
    }
}

module.exports = { fetchMessages };
