require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Mixpanel = require('mixpanel');

// Вставьте ваш токен, полученный от BotFather
const token = process.env.TOKEN;
const webAppUrl = process.env.WEB_APP_URL;
const mixpanelToken = process.env.MIXPANEL_TOKEN;

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Инициализация Mixpanel клиента
const mixpanel = Mixpanel.init(mixpanelToken);

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const user = msg.from;

    // Создаем кнопку с WebAppInfo
    const webAppButton = {
        text: "Start",
        web_app: { url: webAppUrl }
    };

    const replyMarkup = {
        inline_keyboard: [[webAppButton]]
    };

    // Отправляем приветственное сообщение с кнопкой
    bot.sendMessage(chatId, `Привет, ${firstName}!`, {
        reply_markup: replyMarkup
    });

    // Отправка события в Mixpanel
    mixpanel.track('Start Command Used', {
        distinct_id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        chat_id: chatId
    });
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;

    // Исключение команды /start из обработки сообщений
    if (msg.text === '/start') return;

    // Отправка события в Mixpanel
    mixpanel.track('Message Sent', {
        distinct_id: user.id,
        message: msg.text,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        chat_id: chatId
    });
});

console.log('Bot is running...');