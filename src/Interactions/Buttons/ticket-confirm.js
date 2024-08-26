const { ButtonInteraction, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Button = require('../../Core/Structures/Button');

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

    async run (interaction) {
        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle(this.client.config.username)
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

        await this.client.database.add('ticket.count', 1);

        const guild = this.client.guilds.resolve(this.client.config.guild);

        guild.channels.create({
            name: `ticket-${this.client.utils.formatNumber(await this.client.database.get('ticket.count'))}`,
            type: ChannelType.GuildText,
            parent: this.client.config.tickets.category
        })
        .then(async (channel) => {
            await this.client.database.set(`${interaction.user.id}.ticket.channel`, channel.id);
            
            await channel.permissionOverwrites.create(this.client.config.tickets.roles.support, {
                ViewChannel: true
            });

            channel.send({
                content: `${guild.roles.resolve(this.client.config.tickets.roles.support)}`,
                embeds: [
                    new MessageEmbed()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) })
                    .setDescription(await this.client.database.get(`${interaction.user.id}.ticket.message.content`))
                    .setImage(await this.client.database.get(`${interaction.user.id}.ticket.message.image`))
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