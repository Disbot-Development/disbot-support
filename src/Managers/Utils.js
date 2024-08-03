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
     * @param {Number} timeout
     * @returns {Promise<setTimeout>}
     */

    wait(timeout) {
        return new Promise((res) => setTimeout(res, timeout));
    };

    /**
     * 
     * @param {String} path
     * @param {String[]} extensions
     * @returns {String[]}
     */

    getFiles(path, extensions = []) {
        const files = readdirSync(path);
        let result = [];

        for (const file of files) {
            const filePath = `${path}/${file}`;

            if (statSync(filePath).isDirectory()) result = result.concat(this.getFiles(filePath, extensions));
            else if (!extensions.length || extensions.some((ext) => filePath.endsWith(ext))) result.push(filePath);
        };

        return result;
    };

    /**
     * 
     * @param {Number} number
     * @returns {Number}
     */

    formatNumber(number) {
        return `${number}`.padStart(4, '0');
    };
};