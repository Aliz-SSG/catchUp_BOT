function formatMessages(msgObjects) {
    if (!Array.isArray(msgObjects)) return [];
    // normalize to array of plain text strings
    return msgObjects.map(m => (typeof m === 'string' ? m : (m?.text || '')));
}

module.exports = { formatMessages };
