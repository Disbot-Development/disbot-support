require('colors');

const prompts = require('@clack/prompts');
const Disbot = require('./src/Managers/Disbot');
const { GatewayIntentBits, Partials } = require('discord.js');

async function main() {
	prompts.intro(` ${'─'.grey} ${'D'.blue} ${'─'.grey} ${'I'.blue} ${'─'.grey} ${'S'.blue} ${'─'.grey} ${'B'.blue} ${'─'.grey} ${'O'.blue} ${'─'.grey} ${'T'.blue} ${'─'.grey}`);

	prompts.note(
        `Don't stop process during the launch of Disbot Support.\n` +
        `The first launch may take few seconds.`
    );

	prompts.outro(` ${'─'.grey} ${'D'.blue} ${'─'.grey} ${'I'.blue} ${'─'.grey} ${'S'.blue} ${'─'.grey} ${'B'.blue} ${'─'.grey} ${'O'.blue} ${'─'.grey} ${'T'.blue} ${'─'.grey}`);

    const client = new Disbot({
        intents: [
            GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Message,
            Partials.Channel
        ],
        restTimeOffset: 0,
        allowedMentions: {
            repliedUser: false
        }
    });

    client.options.allowedMentions.roles = Object.values(client.config.roles).map((id) => id);
    client.options.allowedMentions.users = client.config.utils.devs;

    client.init();

    module.exports = client;
};

main();
