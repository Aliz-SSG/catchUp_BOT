const dotenv = require('dotenv');
dotenv.config(); // loads the .env file into process.env

const telconf = {
    apiId: process.env.API_ID,
    apiHash: process.env.API_HASH,
    sessionPath: process.env.SESSION_PATH
};

module.exports = telconf;
