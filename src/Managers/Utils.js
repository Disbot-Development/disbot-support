const { readdirSync, statSync } = require('fs');
const client = require('../../index');

module.exports = class Utils {

    /**
     * 
     * @param {client} client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };

    /**
     * 
     * @param {number} timeout
     * @returns {Promise<setTimeout>}
     */

    wait(timeout) {
        return new Promise((res) => setTimeout(res, timeout));
    };

    /**
     * 
     * @param {string} path
     * @returns {string[]}
     */

    getFiles(path) {

        const files = readdirSync(path);

        let result = [];

        for (const file of files) {
            const filePath = `${path}/${file}`;

            if (statSync(filePath).isDirectory()) result = result.concat(this.getFiles(filePath));
            else result.push(filePath);
        };

        return result;
    };

    /**
     * 
     * @param {number} number
     * @returns {number}
     */

    formatNumber(number) {
        return `${number}`.padStart(4, '0');
    };

    /**
     * 
     * @param {array} states
     * @yields {number}
     * @generator
     */

        * stateChanger(states) {
        let i = 0;

        while (true) {
            let plural;
            
            let updatedValue = states[i]['value'].replace(/{\w+}/g, (match) => {
                switch (match) {
                    case '{tickets}':
                        const tickets = this.client.users.cache.filter((user) => user.getData('ticket')).size;

                        plural = tickets > 1;

                        return tickets.toLocaleString('en-US');
                    case '{plural}':
                        return plural ? 's' : '';
                };
            });

            this.client.user.setPresence({
                activities: [
                    {
                        name: updatedValue,
                        type: states[i]['type']
                    }
                ],
                status: 'online'
            });
    
            yield i = ++i % states.length;
        };
    };
};