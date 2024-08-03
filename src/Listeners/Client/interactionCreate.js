const Event = require('../../Managers/Structures/Event');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { Interaction } = require('discord.js');

module.exports = class InteractionCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        });
    };

    /**
     * 
     * @param {Interaction} interaction
     */

    run (interaction) {
        let int;
        if (interaction.isButton()) int = this.client.buttons.get(interaction.customId);

        if (!int) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Désolé, une erreur est survenue.')
            ],
            ephemeral: true
        });

        if (interaction.isButton()) this.client.emit('buttonCreate', interaction, int);
    };
};