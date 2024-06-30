const { ActivityType } = require('discord.js');
const Event = require('../../Managers/Structures/Event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.connection.success({ text: `Disbot Support has been connected to the Discord API.` });

        const states = [
            {
                value: 'Regarde les messages privés',
                type: ActivityType.Custom
            },
            {
                value: `Gère {tickets} ticket{plural}`,
                type: ActivityType.Custom
            }
        ];

        const state = this.client.utils.stateChanger(states);

        setInterval(() => {
            state.next();
        }, 5000);
    };
};