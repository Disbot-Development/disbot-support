require('colors');
require('dotenv').config();

const Disbot = require('./src/Managers/Disbot');
const { GatewayIntentBits, Partials } = require('discord.js');

async function main() {

    const client = new Disbot({
        intents: [
            GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ],
        partials: [
            Partials.Message,
            Partials.Channel
        ],
        allowedMentions: {
            repliedUser: false
        }
    });

    client.options.allowedMentions.roles = Object.values(client.config.tickets.roles).map((id) => id);
    client.options.allowedMentions.users = client.config.utils.devs;

    await client.init();

    module.exports = client;
};

main();
