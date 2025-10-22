require('dotenv').config();
const { Telegraf } = require('telegraf');
const { summarizeCommand } = require('./commands/summarize');
const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { message } = require('telegraf/filters');


const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:2334");
globalThis.fetch = (url, options = {}) => fetch(url, { agent: proxyAgent, ...options });


const bot = new Telegraf(process.env.BOT_TOKEN,{
  telegram: { agent: proxyAgent }})
;

bot.command('summarize', async (ctx) => {
  await summarizeCommand(ctx);
});
bot.on(message('text'), async (ctx)=>{
  ctx.reply('im not here to talk, im here to summarize')
})
bot.start((ctx) => ctx.reply('Welcome! Use /summarize <group> <limit> to get a summary.'));
bot.help((ctx) => ctx.reply('Command: /summarize <group> <limit>'));

bot.launch();
console.log('Bot is running...');
module.exports = bot;
