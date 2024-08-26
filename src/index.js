require('dotenv').config();
require('colors');

const { GatewayIntentBits, Partials } = require('discord.js');

const Bot = require('./Core/Bot');

/**
 *
 * @returns {Promise<undefined>}
 */

async function main() {
    const client = new Bot({
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

    client.options.allowedMentions.roles = Object.values(client.config.tickets.roles);
    client.options.allowedMentions.users = client.config.utils.devs;

    await client.loadAll();
    await client.loadClient();

    module.exports = client;
};

main();
