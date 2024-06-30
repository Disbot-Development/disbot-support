const Button = require('../../Managers/Structures/Button');
const { ButtonInteraction, Colors } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { createTranscript } = require('discord-html-transcripts');

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
        const user = this.client.users.cache.find((user) => user.getData('ticket.channel') === interaction.channel.id);

        const transcript = await createTranscript(interaction.channel, {
            limit: -1,
            filename: `${interaction.channel.name}.html`,
            saveImages: true,
            footerText: '{number} message{s}.',
            poweredBy: false
        });

        interaction.guild.channels.resolve(this.client.config.logs).send({
            files: [transcript]
        });

        interaction.channel.delete()
        .then(() => {
            user.removeData('ticket');
            
            user.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Disbot Support')
                    .setDescription('Votre ticket vient d\'être clôturé. N\'hésitez pas à nous solliciter de nouveau si vous avez besoin de notre aide !')
                    .setColor(Colors.Red)
                ]
            });
        });
    };
};