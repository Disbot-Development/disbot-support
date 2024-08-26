const { ActivityType, PresenceUpdateStatus, Colors } = require('discord.js');

module.exports = class Config {

    /**
     * 
     * @constructor
     */

    constructor() {
        this.username = 'Disbot Support';

        this.utils = {
            token: process.env.TOKEN,
            devs: ['1218940758061617153'],
            version: '1.1.0',
            presence: {
                name: 'Regarde les messages privés',
                type: ActivityType.Custom,
                status: PresenceUpdateStatus.Online
            }
        };

        this.guild = '1238444132704194692';

        this.channels = {
            logs: '1238444203877597237'
        };
        
        this.tickets = {
            category: '1256455026818154578',
            roles: {
                support: '1238444141986316319'
            }
        };

        this.embeds = {
            footer: `${this.username} ©️ ${new Date().getFullYear()}・Propulsé par Disbot Development`,
            color: Colors.Blurple
        };

        this.images = {
            logo: 'https://images.guns.lol/m68GO.png'
        };

        this.emojis = {
            at: '<:d_at:1238444141260574851>',
            bot: '<:d_bot:1238444143429029960>',
            crown: '<:d_crown:1238444146860097587>',
            dev: '<:d_dev:1238444151654322226>',
            disbot: '<:d_disbot:1238444223544688680>',
            dnd: '<:d_dnd:1238444212769259541>',
            fire: '<:d_fire:1238444233925591150>',
            heart: '<:d_heart:1238444236089725020>',
            help: '<:d_help:1238444176379740171>',
            idle: '<:d_idle:1238444204364009564>',
            loading: '<a:d_loading:1238444215575380001>',
            lock: '<:d_lock:1238444145278976091>',
            mod: '<:d_mod:1238444163641380934>',
            money: '<:d_money:1238444148034371596>',
            music: '<:d_music:1238444150022475826>',
            no: '<:d_no:1238444239160082506>',
            offline: '<:d_offline:1238444203244130335>',
            online: '<:d_online:1238444191399415808>',
            partner: '<:d_partner:1238444153268998185>',
            pen: '<:d_pen:1238444156112863284>',
            pin: '<:d_pin:1238444167861112935>',
            rocket: '<:d_rocket:1238444237289295924>',
            search: '<:d_search:1238444154824949760>',
            settings: '<:d_settings:1238444169530441768>',
            sparkles: '<:d_sparkles:1238444179156111380>',
            support: '<:d_support:1238444165973409802>',
            tada: '<:d_tada:1238444181081296896>',
            trophy: '<:d_trophy:1238444226652667975>',
            unlock: '<:d_unlock:1238444225125941278>',
            user: '<:d_user:1238444201096777749>',
            voice: '<:d_voice:1238444189994188830>',
            wrench: '<:d_wrench:1238444188396294164>',
            yes: '<:d_yes:1238444198718345257>'
        };
    };
};
