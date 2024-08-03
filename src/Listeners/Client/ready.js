const Event = require('../../Managers/Structures/Event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.connection.success({ text: `Disbot Support has been connected to the Discord API.` });

        this.client.user.setPresence({
            activities: [
                {
                    name: this.client.config.presence.name,
                    type: this.client.config.presence.type
                }
            ],
            status: this.client.config.presence.status
        });
    };
};