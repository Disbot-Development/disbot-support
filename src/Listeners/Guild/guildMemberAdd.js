const { GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildMemberAdd'
        });
    };

    /**
     * 
     * @param {GuildMember} member
      */


    async run (member) {
        member.send({
            embeds: [
                new MessageEmbed()
                .setTitle(this.client.config.username)
                .setDescription(
                    `${this.client.config.emojis.support}・**1. Support:**\n` +
                    `> - Si vous souhaitez obtenir de l'aide de la part de notre équipe support, merci de m'envoyer un message récapitulant votre problème (veillez à ce que le message contient toutes les informations nécessaires).\n` +
                    `> - Si vous estimez que votre message ne contient pas toutes les informations nécessaires, cliquez sur le bouton \`Retentez\`. Dans le cas contraire, cliquez sur le bouton \`Confirmer\`.\n` +
                    `> - Vous pouvez répondre à l'équipe support, tous les messages de la discussion seront transmis.\n` +
                    `> - Vous pouvez envoyer des images et vidéos, elles seront transmises à l'équipe support.\n\n` +

                    `${this.client.config.emojis.partner}・**2. Partenariat:**\n` +
                    `> - Nous sommes en partenariat avec le serveur \`ᴋᴏᴍᴏʀɪ ·.★\` ! C'est un serveur communautaire inspiré de l'univers japonais.\n` +
                    `> - La communauté y est chaleureuse et active, partagez vos passions avec les membres du serveur !\n` +
                    `> - Cliquez sur le bouton \`Rejoindre ᴋᴏᴍᴏʀɪ ·.★\` afin de rejoindre l'aventure !`
                )
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setURL('https://discord.gg/Fup346TwYy')
                    .setLabel('Rejoindre ᴋᴏᴍᴏʀɪ ·.★')
                    .setStyle(ButtonStyle.Link)
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('sent-from')
                    .setLabel(`Envoyé depuis: ${member.guild.name}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
                )
            ]
        })
        .catch(() => 0);
    };
};