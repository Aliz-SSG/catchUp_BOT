const dotenv = require('dotenv');
dotenv.config(); 

const telconf = {
    apiId: process.env.API_ID,
    apiHash: process.env.API_HASH,
    sessionPath: process.env.SESSION_PATH
};

module.exports = {
    apiId: process.env.API_ID || process.env.API_ID || null,
    apiHash: process.env.API_HASH || process.env.API_HASH || null,
    sessionPath: process.env.SESSION_PATH || process.env.SESSION_PATH || "./session.session"}
