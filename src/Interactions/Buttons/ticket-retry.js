const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Button = require('../../Core/Structures/Button');

module.exports = class TicketRetryButton extends Button {
    constructor(client) {
        super(client, {
            name: 'ticket-retry'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        await this.client.database.delete(`${interaction.user.id}.ticket.message`);

        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle(this.client.config.username)
                .setDescription('Vous pouvez réécrire votre message. Pensez à indiquer toutes les informations importantes dans votre message afin d\'alléger la tâche de l\'équipe support.')
                .setColor(Colors.DarkerGrey)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('ticket-confirm')
                    .setLabel('Confirmer')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                    new ButtonBuilder()
                    .setCustomId('ticket-retry')
                    .setLabel('Retenter')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
                )
            ]
        });
    };
};