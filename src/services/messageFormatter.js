function formatMessages(messages) {
    return messages.map(msg => {
        let text = msg.text || '';
        text = text.replace(/\n+/g, '\n');

        text = text.trim();

        text = text.replace(/https?:\/\/\S+/g, '[link]');

        text = text.replace(/@\w+/g, '[mention]');

        return {
            ...msg,
            formattedText: text
        };
    });
}

module.exports = { formatMessages };
