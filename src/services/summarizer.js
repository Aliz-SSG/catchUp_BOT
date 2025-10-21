const axios = require('axios'); 
const { chunkMessages } = require('../utils/textChunker'); 

async function summarizeChunk(chunk, apiKey) {
    try {
        const response = await axios.post('https://api.deepseek.ai/summarize', {
            messages: chunk
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        return response.data.summary;
    } catch (error) {
        console.error('Error summarizing chunk:', error.message);
        return ''; 
    }
}
async function summarizeMessages(messages, apiKey) {

    const chunks = chunkMessages ? chunkMessages(messages) : [messages];

    const summaries = [];
    for (const chunk of chunks) {
        const summary = await summarizeChunk(chunk, apiKey);
        summaries.push(summary);
    }

    return summaries.join('\n\n');
}

module.exports = { summarizeMessages };