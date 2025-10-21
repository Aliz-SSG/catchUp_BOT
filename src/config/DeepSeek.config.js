const dotenv = require('dotenv');
dotenv.config();

const dsconf = {
    apiKey: process.env.DEEPSEEK_API_KEY
};

module.exports = dsconf;
