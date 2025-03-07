const Event = require('../../Core/Structures/Event');

module.exports = class ProcessWarningEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'warning',
            process: true
        });
    };

    /**
     * 
     * @param {string} error 
     */

    run (error) {
        this.client.logger.error(`Warning: ${`${error.stack ? error.stack : error.message}`.red}\n`);
    };
};