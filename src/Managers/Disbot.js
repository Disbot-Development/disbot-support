const { Client, Collection, PermissionFlagsBits } = require('discord.js');
const { createSpinner } = require('nanospinner');
const Prototypes = require('./Prototypes');
const Config = require('./Config');
const Utils = require('./Utils');
const Logger = require('./Logger');
const Database = require('quick.db');

module.exports = class Disbot extends Client {

    /**
     * 
     * @param {Client.options} options
     * @constructor
     */

    constructor(options) {
        super(options);

        new Prototypes(this)
    };

    config = new Config(this);
    utils = new Utils(this);
    logger = new Logger(this);

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
     * 
     * @typedef {object} SelectMenuConfig
     * @property {string} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} SelectMenu
     * @property {SelectMenuConfig} config
     */

    /**
     * @type {Collection<string, SelectMenu>}
     */

    selectmenus = new Collection();

    /**
     * 
     * @typedef {object} ModalConfig
     * @property {string} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} Modal
     * @property {ModalConfig} config
     */

    /**
     * @type {Collection<string, Modal>}
     */

    modals = new Collection();

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
        this.database = Database;

        this.logger.success('The database was linked.');

        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {true}
     */

    loadButtons(logging) {
        const filesPath = this.utils.getFiles('./src/Interactions/Buttons');

        for (const path of filesPath) {
            const button = new (require(`../../${path}`))(this);

            if (!button.run || !button.config || !button.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.buttons.set(button.config.name, button);
        };

        if (!logging) {
            this.logger.success(`${this.buttons.size} Buttons has been loaded.`);
        };
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadEvents() {
        const filesPath = this.utils.getFiles('./src/Listeners');

        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);

            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            switch (path.match(/\w{0,255}\/(\w{0,252}\.js)$/g)[0].split('/')[0]) {
                case 'Process':
                    process.on(event.config.name, (...args) => event.run(...args));
                break;
                default:
                    this.on(event.config.name, (...args) => event.run(...args));
                break;
            };
        };

        this.logger.success(`${this._eventsCount} Events has been loaded.\n`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadButtons() {
        this.buttons.clear();

        const filesPath = this.utils.getFiles('./src/Interactions/Buttons');

        for (const path of filesPath) {
            delete require.cache[require.resolve(`../../${path}`)];
        };

        this.loadButtons(true);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadAll() {
        const spinner = createSpinner('Reloading Disbot Support...').start();

        this.verifications(true);
        this.reloadButtons();

        spinner.success({ text: 'Disbot Support has been reloaded.\n' });

        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {Promise<true>}
     */

    loadClient(logging) {
        if (!logging) {
            this.connection = createSpinner('Connecting Disbot Support to the Discord API...').start();
        };

        this.login(this.config.utils.token);

        return new Promise(() => true);
    };

    /**
     * 
     * @returns {true}
     */

    async init() {
        this.loadDatabase();

        this.loadButtons();
        this.loadEvents();

        await this.utils.wait(100);

        this.loadClient();

        return true;
    };
};