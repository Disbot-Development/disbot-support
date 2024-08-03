const Event = require('../../Managers/Structures/Event');
const { Message, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageType } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class MessageCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate'
        });
    };

    /**
     * 
     * @param {Message} message
      */


    async run (message) {
        if (message.type === MessageType.ChannelPinnedMessage && message.author.id === this.client.user.id) message.delete();

        if (message.author.bot) return;

        if (message.mentions.has(this.client.user, { ignoreEveryone: true, ignoreRepliedUser: true, ignoreRoles: true }) && message.guild) return message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Disbot Support')
                .setDescription(
                    `${this.client.config.emojis.help} Vous m'avez mentionné ?\n` +
                    `${this.client.config.emojis.support} Afin d'obtenir de l'aide, envoyez-moi un message privé ! Vous recevrez une réponse de notre équipe support dans les plus brefs délais !`
                )
            ]
        });

        const guild = this.client.guilds.resolve(this.client.config.guild);
        
        const users = await Promise.all(this.client.users.cache.map(async (user) => {
            const ticketChannelId = await this.client.database.get(`${user.id}.ticket.channel`);
            return { user, ticketChannelId };
        }));

        const user = users.find(({ ticketChannelId }) => ticketChannelId === message.channel.id)?.user;
        
        if (message.channel.type === ChannelType.DM) {
            if (await this.client.database.get(`${message.author.id}.ticket.channel`)) {
                const channel = guild.channels.resolve(await this.client.database.get(`${message.author.id}.ticket.channel`));

                if (!channel) {
                    await this.client.database.delete(`${message.author.id}.ticket`);
                    return this.client.emit('messageCreate', message);
                };

                guild.channels.resolve(await this.client.database.get(`${message.author.id}.ticket.channel`)).send({
                    embeds: [
                        new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ size: 1024 }) })
                        .setDescription(message.content.trim())
                        .setImage(message.attachments.first()?.proxyURL)
                    ]
                })
                .then(() => {
                    message.react(this.client.config.emojis.yes);
                })
                .catch(() => {
                    message.react(this.client.config.emojis.no);
                });
            };

            if (await this.client.database.get(`${message.author.id}.ticket.message`)) return;

            await this.client.database.set(`${message.author.id}.ticket.message.content`, message.content.trim());
            if (message.attachments.size) await this.client.database.set(`${message.author.id}.ticket.message.image`, message.attachments.first()?.proxyURL);

            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Disbot Support')
                    .setDescription('Tentez-vous de créer un ticket par messages privés ? Si c\'est votre cas, vérifiez que votre message contient toutes informations que vous souhaitez transmettre à l\'équipe support.')
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('ticket-confirm')
                        .setLabel('Confirmer')
                        .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                        .setCustomId('ticket-retry')
                        .setLabel('Retenter')
                        .setStyle(ButtonStyle.Secondary)
                    )
                ]
            });
        } else if (user) {
            user.send({
                embeds: [
                    new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ size: 1024 }) })
                    .setDescription(message.content.trim())
                    .setImage(message.attachments.first()?.proxyURL)
                ]
            })
            .then(() => {
                message.react(this.client.config.emojis.yes);
            })
            .catch(() => {
                message.react(this.client.config.emojis.no);
            });
        };
    };
};