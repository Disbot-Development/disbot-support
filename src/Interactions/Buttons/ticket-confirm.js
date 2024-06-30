const Button = require('../../Managers/Structures/Button');
const { ButtonInteraction, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class TicketConfirmButton extends Button {
    constructor(client) {
        super(client, {
            name: 'ticket-confirm'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    run (interaction) {
        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle('Disbot Support')
                .setDescription('Votre message a été transmis a l\'équipe support. Une réponse vous sera donnée d\'ici peu de temps.')
                .setColor(Colors.Green)
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

        this.client.addData('ticket.count', 1);

        const guild = this.client.guilds.resolve(this.client.config.guild);

        guild.channels.create({
            name: `ticket-${this.client.utils.formatNumber(this.client.getData('ticket.count'))}`,
            type: ChannelType.GuildText,
            parent: this.client.config.category
        })
        .then(async (channel) => {
            interaction.user.setData('ticket.channel', channel.id);
            
            await channel.permissionOverwrites.create(this.client.config.roles.support, {
                ViewChannel: true
            });

            channel.send({
                content: `${guild.roles.resolve(this.client.config.roles.support)}`,
                embeds: [
                    new MessageEmbed()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
                    .setDescription(interaction.user.getData('ticket.message.content'))
                    .setImage(interaction.user.getData('ticket.message.image'))
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('ticket-close')
                        .setLabel('Fermer')
                        .setStyle(ButtonStyle.Danger)
                    )
                ]
            })
            .then((message) => {
                message.pin();
            });
        });
    };
};