function chunkMessages(messages, maxLength = 2000) {
    const chunks = [];
    let currentChunk = [];

    let currentLength = 0;
    messages.forEach(msg => {
        const msgLength = msg.formattedText.length;
        if (currentLength + msgLength > maxLength) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentLength = 0;
        }
        currentChunk.push(msg);
        currentLength += msgLength;
    });

    if (currentChunk.length) chunks.push(currentChunk);

    return chunks;
}

module.exports = { chunkMessages };
