const { formatMessages } = require('../../services/messageFormatter');
const { summarizeMessages } = require('../../services/summarizer');
const { fetchMessages } = require('../../services/messageFetcher');
const telegramClientSvc = require('../../services/telegramClient'); 

async function summarizeCommand(ctx) {
    try {
        const args = ctx.message.text.split(' ').slice(1);
        const group = args[0];
        const limit = parseInt(args[1]) || 50;

        let client = telegramClientSvc.client;
        if (!client && typeof telegramClientSvc.getClient === 'function') {
            client = await telegramClientSvc.getClient();
        } else if (!client && typeof telegramClientSvc.connectTelegram === 'function') {
            client = await telegramClientSvc.connectTelegram();
        }

        if (!client) {
            return ctx.reply('Telegram client not available. Check bot configuration.');
        }

        const messages = await fetchMessages(client, group, limit);
        if (!Array.isArray(messages) || messages.length === 0) {
            return ctx.reply('No messages found for this group.');
        }

        const formattedMessages = formatMessages(messages); 

        const summary = await summarizeMessages(formattedMessages, config.apiKey);
        ctx.reply(summary || 'Could not generate summary.');
    } catch (error) {
        console.error('Error in summarize command:', error);
        ctx.reply('An error occurred while summarizing messages.');
    }
}

module.exports = { summarizeCommand };
