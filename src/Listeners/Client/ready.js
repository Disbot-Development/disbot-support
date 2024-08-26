const Event = require('../../Core/Structures/Event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.connection.success({ text: `${this.client.config.username} has been connected to the Discord API.` });
        
        this.client.loadPresence({
            name: this.client.config.utils.presence.name,
            type: this.client.config.utils.presence.type,
            status: this.client.config.utils.presence.status
        });
    };
};