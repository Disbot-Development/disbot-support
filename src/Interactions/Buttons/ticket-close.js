const { createTranscript } = require('discord-html-transcripts');
const { ButtonInteraction, Colors } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Button = require('../../Core/Structures/Button');

module.exports = class TicketCloseButton extends Button {
    constructor(client) {
        super(client, {
            name: 'ticket-close'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const users = await Promise.all(this.client.users.cache.map(async (user) => {
            const ticketChannelId = await this.client.database.get(`${user.id}.ticket.channel`);
            return { user, ticketChannelId };
        }));

        const user = users.find(({ ticketChannelId }) => ticketChannelId === interaction.channel.id)?.user;

        const transcript = await createTranscript(interaction.channel, {
            limit: -1,
            filename: `${interaction.channel.name}.html`,
            saveImages: true,
            footerText: '{number} message{s}.',
            poweredBy: false
        });

        interaction.guild.channels.resolve(this.client.config.channels.logs).send({
            files: [transcript]
        });

        interaction.channel.delete()
        .then(async () => {
            await this.client.database.delete(`${user.id}.ticket`);
            
            user.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle(this.client.config.username)
                    .setDescription('Votre ticket vient d\'être clôturé. N\'hésitez pas à nous solliciter de nouveau si vous avez besoin de notre aide !')
                    .setColor(Colors.Red)
                ]
            })
            .catch(() => 0);
        });
    };
};