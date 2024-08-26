const { RateLimitData } = require('discord.js');

const Event = require('../../Core/Structures/Event');

module.exports = class RateLimitEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'rateLimit',
            rest: true
        });
    };

    /**
     * 
     * @param {RateLimitData} data 
     */

    run (data) {
        this.client.logger.error(`Rate limited for: ${`${Math.floor(data.retryAfter / 1000 / 60)} minute${Math.floor(data.retryAfter / 1000 / 60) > 1 ? 's' : ''}`.red}\n`);
    };
};