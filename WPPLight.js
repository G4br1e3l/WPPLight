import baileys from '@whiskeysockets/baileys'
const {
    default: makeWASocket,
    makeInMemoryStore,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers,
} = baileys

import {
    readFileSync,
    writeFileSync,
    unlink,
    readdirSync,
} from "fs";

import P from 'pino'

import chalk from "chalk"

import CFonts from 'cfonts'
const { render } = CFonts

import { GetQR } from './lib/conn/QRCODE.js'

var Config = JSON.parse(readFileSync("./lib/conn/config.json"))
var Comma_msg = Config.commands[0].messages || {}

var Sett = JSON.parse(readFileSync("./lib/conn/set.json"))
var Bot_cfg = Sett.bot[0] || {}

var Meta = JSON.parse(readFileSync("./lib/conn/metadata.json"))
var Metadata = Meta.metadata || {}

process.on('uncaughtException', err => console.error(err.stack));

console.warn = () => {}
const msgRetryCounterMap = {}

const PACKAGE = JSON.parse(readFileSync('./package.json', 'utf8'))

const history = !process.argv.includes('--no-store')? makeInMemoryStore({ logger: P({ level: 'silent', stream: "store", transport: { target: 'pino-pretty', options: { levelFirst: true, ignore: 'pid,hostname,node,browser,helloMsg,path', colorize: true }}})}) : undefined
history?.readFromFile('./root/connections/history.json')
setInterval(() => { history?.writeToFile('./root/connections/history.json') }, 10_000)

const colorA = chalk.rgb(123, 123, 123).bgGreenBright.bold.inverse;

const Named = ({ Client: WPPL }) => {
    const extractBotId = id => ((id.match(/(\w+)(@\w+)?/) || [])[1] || '').match(/(\w+)(:\w+)?/)[1] || '';
    const updateBotConfig = (bb, authState) => {
        let aa = bb.bot[0];
        if (!aa) throw new Error('Não foi possível encontrar as propriedades do bot no arquivo de configuração.');
        const { id, name } = authState?.creds?.me || {};
        aa.id = extractBotId(id) || '00000000000';
        aa.username = name || 'WWPLight';
        aa.name = 'WWPLight';
        aa.trusted = 'trusted';
        return bb;
    };
    writeFileSync("./lib/conn/set.json", JSON.stringify(updateBotConfig(Sett, WPPL.authState)));
};

const setReceiver = async ({ Client: WPPL, Up: MSG }) => {
    var { remoteJid = null } = Metadata.store[0] || {};
    const { key: Key = undefined } = MSG.messages[0] || {};
    const createdData = async (Key, WPPL, remoteJid) => remoteJid.push(JSON.parse(`{"${Key.remoteJid}": ${JSON.stringify(await WPPL.groupMetadata(Key.remoteJid))}}`)) && writeFileSync("./lib/conn/metadata.json", JSON.stringify(Meta));
    Key.remoteJid.endsWith('@g.us')? await (async argaIndex => argaIndex >= 0 ? Metadata.store[0].remoteJid[argaIndex] : await createdData(Key, WPPL, remoteJid))([...new Set(Object.keys(remoteJid)?.flatMap(key => Object.keys(remoteJid[key])?.[0]))].indexOf(Key.remoteJid)) : undefined;
};

async function WPPLight() {

    const { state, saveCreds } = await useMultiFileAuthState('./root/connections')
    const { version, isLatest } = await fetchLatestBaileysVersion()
    
    console.log(colorA(render((`${Bot_cfg.name} Por ${PACKAGE.author.split(' ')[0]} v${PACKAGE.version}`), { font: 'shade', align: 'left', colors: 'redBright', background: 'transparent', letterSpacing: 1, lineHeight: 0, space: true, maxLength: 0, gradient: true, independentGradient: false, transitionGradient: true, env: 'node' }).string))
    console.log(colorA(render((`${PACKAGE.name} - ${PACKAGE.description} |Versao Atual: ${version} Atualizado: ${isLatest}`), { font: 'console', align: 'left', colors: 'redBright', background: 'transparent', letterSpacing: 0, lineHeight: 0, space: true, maxLength: 0, gradient: true, independentGradient: true, transitionGradient: true, env: 'node' }).string))

    const WPPL = makeWASocket({
        logger: P({ level: 'silent', stream: "store", transport: { target: 'pino-pretty', options: { levelFirst: true, ignore: 'pid,hostname,node,browser,helloMsg,path', colorize: true }}}),
        msgRetryCounterMap,
        generateHighQualityLinkPreview: true,
        printQRInTerminal: true,
        browser: Browsers.macOS('Desktop'),
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        auth: state,
        version
    })

    history?.bind(WPPL.ev)

    WPPL.ev.on('events.call', async e_call => {})
    WPPL.ev.on('creds.update', async cr_update => { await saveCreds() })
    WPPL.ev.on('contacts.upsert', async c_upsert => {})
    WPPL.ev.on('messages.update', async m_update => {})
    WPPL.ev.on('message-receipt.update', async mr_update => {})
    WPPL.ev.on('messages.reaction', async m_reaction => {})
    WPPL.ev.on('messaging-history.set', async mh_set => {})
    WPPL.ev.on('presence.update', async p_update => {})
    WPPL.ev.on('chats.update', async ch_update => {})
    WPPL.ev.on('chats.delete', async ch_delete => {})
    WPPL.ev.on('chats.upsert', async ch_upsert => {})

    WPPL.ev.on('connection.update', async update => {
        const { connection, lastDisconnect, qr = false } = update || {}
        if (qr) await GetQR(qr).then(() => console.log(colorA(`${Comma_msg.startup.onqrscan}`)));
        switch(connection){
            case 'close':
                console.log(colorA(Comma_msg.startup.ondownconnection))
                if((lastDisconnect.error)?.output?.statusCode === DisconnectReason.loggedOut) console.log(colorA('Ultima sessão desconectada.'))
                switch((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut){
                    case true:
                        if (Bot_cfg.trusted !== 'trusted') Named({ Client:WPPL })
                        console.log(colorA(Comma_msg.startup.onreconect))
                        await WPPLight()
                    break
                    case false:
                        console.log(colorA(Comma_msg.startup.onlostconnection))
                        readdirSync('./root/connections').forEach(file => unlink(`./root/connections/${file}`, () => {}))
                        await WPPLight()
                    break
                }
            break
            case 'open':
                console.log(colorA(Comma_msg.startup.onconnected.replaceAll('@botname', Bot_cfg.name)))
            break
            case 'connecting':
                console.log(colorA(Comma_msg.startup.onconnect))
            break
            default: break
        }
    })

    WPPL.ev.on('group-participants.update', async gp_update => {
        const { remoteJid } = Metadata.store[0] || {}
        remoteJid.splice([Object.keys(remoteJid).map(chat => Object.keys(remoteJid[chat])[0])].indexOf(gp_update.id), 1)
        writeFileSync("./lib/conn/metadata.json" || {}, JSON.stringify(Meta))
    })

    WPPL.ev.on('messages.upsert', async msg_upsert => {
        const { key: Key = undefined } = msg_upsert.messages[0] || {};
        if (Key.remoteJid.endsWith('@g.us')) await setReceiver({ Client: WPPL, Up: msg_upsert })
        await WPPL.sendPresenceUpdate('available', Key.remoteJid).then(() => WPPL.readMessages([Key])).catch(() => {});
        setTimeout(async () => await WPPL.sendPresenceUpdate('unavailable'), 10000);

        console.log(msg_upsert)
    })
}

WPPLight()