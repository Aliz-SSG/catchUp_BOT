const dotenv = require('dotenv');
dotenv.config();

const dsconf = {
    apiKey: process.env.DEEPSEEK_API_KEY
};

module.exports = {
    apiKey: process.env.DEEPSEEK_API_KEY || process.env.API_KEY || null,
};
