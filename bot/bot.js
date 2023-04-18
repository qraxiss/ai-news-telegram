require('dotenv').config();
const {opinion} = require('./commands/news');
const {http} = require('http')

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_API;
const bot = new TelegramBot(token);

opinion(bot)

module.exports = {
    bot
}