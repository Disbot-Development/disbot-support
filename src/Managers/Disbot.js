const { Client, Collection, PermissionFlagsBits } = require('discord.js');
const { createSpinner } = require('nanospinner');
const { QuickDB } = require('quick.db');

const Config = require('./Config');
const Logger = require('./Logger');
const Utils = require('./Utils');

module.exports = class Disbot extends Client {

    /**
     * 
     * @param {Client.options} options
     * @constructor
     */

    constructor(options) {
        super(options);
    };

    config = new Config();
    utils = new Utils(this);
    logger = new Logger();

    /**
     * 
     * @typedef {object} ButtonConfig
     * @property {string} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} Button
     * @property {ButtonConfig} config
     */

    /**
     * @type {Collection<string, Button>}
     */

    buttons = new Collection();

    /**
     * @returns {Collection<string, CommandConfig|ContextMenuConfig>}
     */

    get interactions() {
        return [].concat(this.commands.map((command) => command.config), this.contextmenus.map((contextmenu) => contextmenu.config));
    };

    /**
     * 
     * @returns {true}
     */

    loadDatabase() {
        this.database = new QuickDB();

        this.logger.success('The database was linked.');

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadButtons() {
        const filesPath = this.utils.getFiles('./src/Interactions/Buttons', ['.js']);

        for (const path of filesPath) {
            const button = new (require(`../../${path}`))(this);

            if (!button.run || !button.config || !button.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.buttons.set(button.config.name, button);
        };

        this.logger.success(`${this.buttons.size} Buttons has been loaded.`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadEvents() {
        const filesPath = this.utils.getFiles('./src/Listeners', ['.js']);

        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);

            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            const parentFolder = path.match(/\w{0,255}\/(\w{0,252}\.js)$/g)[0].split('/')[0];

            if (event.config.name === 'rateLimited') this.rest.on(event.config.name, (...args) => event.run(...args));
            else if (parentFolder === 'Process') process.on(event.config.name, (...args) => event.run(...args));
            else this.on(event.config.name, (...args) => event.run(...args));
        };

        this.logger.success(`${this._eventsCount} Events has been loaded.\n`);
    
        return true;
    };

    /**
     * 
     * @returns {Promise<string>}
     */

    loadClient() {
        this.connection = createSpinner('Connecting Disbot to the Discord API...').start();

        return this.login(this.config.utils.token);
    };

    /**
     * 
     * @returns {Promise<string>}
     */

    async init() {
        this.loadDatabase();

        this.loadButtons();
        this.loadEvents();

        return this.loadClient();;
    };
};