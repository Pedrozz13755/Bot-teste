const { 
    default: makeWASocket, 
    downloadContentFromMessage,  
    emitGroupParticipantsUpdate,  
    emitGroupUpdate,  
    makeInMemoryStore,  
    prepareWAMessageMedia, 
    MediaType,  
    WAMessageStatus, 
    AuthenticationState, 
    GroupMetadata, 
    initInMemoryKeyStore, 
    MiscMessageGenerationOptions,  
    useMultiFileAuthState, 
    BufferJSON,  
    WAMessageProto, 
    MessageOptions, 
    PHONENUMBER_MCC,	
    WAFlag,  
    WANode,	
    WAMetric,	
    ChatModification,  
    MessageTypeProto,  
    WALocationMessage, 
    ReconnectMode,  
    WAContextInfo,  
    proto,	
    WAGroupMetadata,  
    ProxyAgent,	
    waChatKey,  
    MimetypeMap,  
    MediaPathMap,  
    WAContactMessage,  
    WAContactsArrayMessage,  
    WAGroupInviteMessage,  
    WATextMessage,  
    WAMessageContent,  
    WAMessage,  
    BaileysError,  
    WA_MESSAGE_STATUS_TYPE,  
    MediaConnInfo,   
    generateWAMessageContent, 
    URL_REGEX,  
    Contact, 
    WAUrlInfo,  
    WA_DEFAULT_EPHEMERAL,  
    WAMediaUpload,  
    mentionedJid,  
    processTime,	
    Browser, 
    makeCacheableSignalKeyStore,  
    MessageType,  
    Presence,  
    WA_MESSAGE_STUB_TYPES,  
    Mimetype,  
    relayWAMessage,	
    Browsers,  
    GroupSettingChange,  
    delay,  
    DisconnectReason,  
    WASocket,  
    getStream,  
    WAProto,  
    isBaileys,  
    AnyMessageContent,  
    generateWAMessageFromContent, 
    fetchLatestBaileysVersion,  
    processMessage,  
    processingMutex
} = require('@whiskeysockets/baileys');

const express = require("express");
const pino = require('pino');
const fs = require('fs');
const axios = require('axios');
const PhoneNumber = require('awesome-phonenumber');
const readline = require("readline");
const NodeCache = require("node-cache");

const phoneNumber = "557792142954";
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const PORT = 8080;
const app = express();
const donoName = 'pedrozz moddz';
const botName = 'teste bot';

async function ligarbot() {
    const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) });

    const { state, saveCreds } = await useMultiFileAuthState('./dono/bot-qr');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const msgRetryCounterCache = new NodeCache();

    const client = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        mobile: useMobile,
        browser: ['Chrome (Linux)', '', ''],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    });

    store.bind(client.ev);

    if (pairingCode && !client.authState.creds.registered) {
        if (useMobile) throw new Error('Não é possível usar o código de pareamento com a API móvel');

        let phoneNumber = await question(`Digite seu número do WhatsApp (ex: +557792142954): `);
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Comece com o código do país do seu número do WhatsApp, exemplo: +557792142954");
            process.exit(0);
        }

        setTimeout(async () => {
            let code = await client.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`Seu código de emparelhamento: ${code}`);
        }, 3000);
    }

    client.ev.on('chats.set', () => {
        console.log('Setando conversas...');
    });

    client.ev.on('contacts.set', () => {
        console.log('Setando contatos...');
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const info = messages[0];
            if (!info.message) return;

            const key = {
                remoteJid: info.key.remoteJid,
                id: info.key.id,
                participant: info.key.participant
            };
            await client.readMessages([key]);

            if (info.key && info.key.remoteJid == 'status@broadcast') return;
            const altpdf = Object.keys(info.message);
            const type = altpdf[0] === 'senderKeyDistributionMessage' ? altpdf[1] === 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0];

            const from = info.key.remoteJid;

            const body = (type === 'conversation') ? info.message.conversation : 
                (type === 'imageMessage') ? info.message.imageMessage.caption : 
                (type === 'videoMessage') ? info.message.videoMessage.caption : 
                (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : 
                (type === 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : 
                (info.message.listResponseMessage && info.message.listResponseMessage.singleSelectReply.selectedRowId.startsWith(prefix) && info.message.listResponseMessage.singleSelectReply.selectedRowId) ? info.message.listResponseMessage.singleSelectReply.selectedRowId : 
                (type === 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId : 
                (type === 'messageContextInfo') ? (info.message.buttonsResponseMessage?.selectedButtonId || info.message.listResponseMessage?.singleSelectReply.selectedRowId || info.text) : '';

            const prefix = '£';
            const isCmd = body.startsWith(prefix);
            const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;

            const escrever = async (texto) => {
                await client.sendPresenceUpdate('composing', from);
                await delay(1000);
                client.sendMessage(from, { text: texto }, { quoted: info });
            };

            const enviar = (texto) => {
                client.sendMessage(from, { text: texto }, { quoted: info });
            };

            const delay = (tempo) => new Promise(res => setTimeout(res, tempo));

            switch (comando) {
                case 'escreva':
                    escrever('ear mano, de boa?');
                    break;

                case 'responda':
                    enviar('opa');
                    break;

                default:
                    if (isCmd) {
                        client.sendMessage(from, {
                            text: `
╭━─≪𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐈𝐍𝐄𝐗𝐈𝐒𝐓𝐄𝐍𝐓𝐄≫─━╮
│╭─────────────╮
││➥[ 👤 ] *OLÁ HUMANO:*
││➥[ 🙄 ] *ACHO QUE TE FALTA LER O MENU*
││➥[ 📄 ] *COMANDO:* *_${comando}_*
│╰─────────────╯
╰━──≪  ${donoName}  ≫─━━╯
`
                        });
                    }
                    break;
            }
        } catch (erro) {
            console.log(erro);
        }
    });

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) ligarbot();
        }

        if (update.isNewLogin) {
            console.log('Conectado com sucesso');
        }
    });
}

ligarbot();

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

fs.watchFile('./index.js', (curr, prev) => {
    if (curr.mtime.getTime() !== prev.mtime.getTime()) {
        console.log('A index foi editada, irei reiniciar...');
        process.exit();
    }
});
       
