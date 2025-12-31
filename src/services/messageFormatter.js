function formatMessages(msgObjects) {
    if (!Array.isArray(msgObjects)) return [];
    return msgObjects.map(m => (typeof m === 'string' ? m : (m?.text || '')));
}

module.exports = { formatMessages };
