const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require('axios');
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEATHER_API_KEY = process.env.WEATHER_API;

try {
  bot.start((ctx) =>
    ctx.reply(
      "\n\n\nWelcome to TeleWiz\n\n\nType /info to know what this bot can do\n\n\nType /help to know all commands.\n\n\n"
    )
  );
  bot.help((ctx) =>
    ctx.reply(
      "\n\n\nCommand for weather info is :\n\n\n /weather <yourCityName>\n\n\n\n\n\n"
    )
  );
  bot.on(message("sticker"), (ctx) => ctx.reply("♥"));
  bot.hears("Hi", (ctx) => ctx.reply("Hey there!\n\n\nType /start to start this bot"));

  bot.command("info", (ctx) =>
    ctx.reply(
      "\n\n\nThis bot can gives you weather information on the city you asked for!\n\n\nCommand is : /weather <yourCityName>\n\n\n"
    )
  );

  //weather command
  bot.command('weather', async (ctx) => {
    const city = ctx.message.text.split(' ').slice(1).join(' ');
    
    if (!city) {
        ctx.reply('Please specify a city.\n\n/weather <yourCityName>');
        return;
    }

    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = response.data;
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const cityName = data.name;
        const country = data.sys.country;

        const weatherInfo = `Weather in ${cityName}, ${country}:\n\n` +
                            `${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}\n\n` +
                            `Temperature: ${temperature}°C`;

        ctx.reply(weatherInfo);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            ctx.reply('City not found.');
        } else {
            ctx.reply('Error connecting to the weather service. Please try again later.');
        }
    }
});

  bot.launch();
} catch (error) {
  console.log(error.message);
}
