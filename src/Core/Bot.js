const { Client, ClientOptions, Collection, PermissionFlagsBits, ActivityType, PresenceUpdateStatus, ClientPresence } = require('discord.js');
const { createSpinner } = require('nanospinner');
const { QuickDB } = require('quick.db');

const Config = require('./Config');
const Logger = require('../Commons/Logger');
const Utils = require('../Commons/Utils');

module.exports = class Bot extends Client {

    /**
     * 
     * @param {ClientOptions} options
     * @constructor
     */

    constructor(options) {
        super(options);
    };

    config = new Config();
    utils = new Utils();
    logger = new Logger(this.config);
    
    performance = { start: 0, end: 0 };

    /**
     * 
     * @typedef {Object} ButtonConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {Object} Button
     * @property {ButtonConfig} config
     */

    /**
     * @type {Collection<String, Button>}
     */

    buttons = new Collection();

    /**
     * 
     * @typedef {Object} EventConfig
     * @property {String} name
     */

    /**
     * 
     * @typedef {Object} Event
     * @property {EventConfig} config
     */

    /**
     * @type {Collection<String, Event>}
     */

    events = new Collection();

    /**
     * @returns {Collection<String, CommandConfig|ContextMenuConfig>}
     */

    get interactions() {
        return [].concat(this.commands.map((command) => command.config), this.contextmenus.map((contextmenu) => contextmenu.config));
    };

    /**
     * 
     * @param {Object} options
     * @param {String} options.name
     * @param {ActivityType} options.type
     * @param {PresenceUpdateStatus} options.status
     * @returns {ClientPresence}
     */

    loadPresence(options) {
        return this.user.setPresence({
            activities: [{ name: options.name, type: options.type }],
            status: options.status
        });
    };

    /**
     * 
     * @returns {QuickDB<any>}
     */

    async loadDatabase() {
        this.performance.start = performance.now();

        this.database = new QuickDB();

        this.performance.end = performance.now();

        this.logger.success('The database was linked.', { start: this.performance.start, end: this.performance.end });
        return this.database;
    };

    /**
     * 
     * @returns {Promise<Collection<String, Button>>}
     */

    async loadButtons() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Interactions/Buttons', ['.js']);
        for (const path of filesPath) {
            const button = new (require(`../../${path}`))(this);
            if (!button.run || !button.config || !button.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.buttons.set(button.config.name, button);
        };

        this.performance.end = performance.now();

        this.logger.success(`${this.buttons.size} buttons has been loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.buttons;
    };

    /**
     * 
     * @returns {Promise<Collection<String, Event>>}
     */

    async loadEvents() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Listeners', ['.js']);
        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);
            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.events.set(event.config.name, event);

            const target = event.config.rest ? this.rest : event.config.process ? process : this;
            target.on(event.config.name, (...args) => event.run(...args));
        };

        this.performance.end = performance.now();

        this.logger.success(`${this._eventsCount} events has been loaded.`, { start: this.performance.start, end: this.performance.end, inline: true });
        return this.events;
    };

    /**
     * 
     * @returns {Promise<true>}
     */

    async loadAll() {
        await this.loadDatabase();

        await this.loadButtons();
        await this.loadEvents();

        return true;
    };

    /**
     * 
     * @returns {Promise<String|Spinner>}
     */

    async loadClient() {
        this.connection = createSpinner(`Connecting ${this.config.username} to the Discord API...`).start();

        return this.login(this.config.utils.token).catch(() => this.connection.error({ text: `${this.config.username} was unable to connect to the Discord API.` }));
    };
};