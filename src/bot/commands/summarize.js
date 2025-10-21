const { formatMessages } = require('../../services/messageFormatter');
const { summarizeMessages } = require('../../services/summarizer');
const  fetchMessages  = require('../../services/messageFetcher');
const config = require('../../config/DeepSeek.config');

async function summarizeCommand(ctx) {
    try {

        const args = ctx.message.text.split(' ').slice(1);
        const group = args[0];
        const limit = parseInt(args[1]) || 50;


        const messages = await fetchMessages.fetchRecentMessages(group, limit);
        if (!messages || messages.length === 0) {
            return ctx.reply('No messages found for this group.');
        }

  
        const formattedMessages = formatMessages(messages);


        const summary = await summarizeMessages(formattedMessages, config.API_KEY);

        ctx.reply(summary || 'Could not generate summary.');

    } catch (error) {
        console.error('Error in summarize command:', error);
        ctx.reply('An error occurred while summarizing messages.');
    }
}

module.exports = { summarizeCommand };
