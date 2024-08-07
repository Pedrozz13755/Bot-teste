
const { 
default: makeWASocket, downloadContentFromMessage,  emitGroupParticipantsUpdate,  emitGroupUpdate,  makeInMemoryStore,  prepareWAMessageMedia, MediaType,  WAMessageStatus, AuthenticationState, GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions,  useMultiFileAuthState, BufferJSON,  WAMessageProto,  MessageOptions, PHONENUMBER_MCC,	 WAFlag,  WANode,	 WAMetric,	 ChatModification,  MessageTypeProto,  WALocationMessage, ReconnectMode,  WAContextInfo,  proto,	 WAGroupMetadata,  ProxyAgent,	 waChatKey,  MimetypeMap,  MediaPathMap,  WAContactMessage,  WAContactsArrayMessage,  WAGroupInviteMessage,  WATextMessage,  WAMessageContent,  WAMessage,  BaileysError,  WA_MESSAGE_STATUS_TYPE,  MediaConnInfo,   generateWAMessageContent, URL_REGEX,  Contact, WAUrlInfo,  WA_DEFAULT_EPHEMERAL,  WAMediaUpload,  mentionedJid,  processTime,	 Browser, makeCacheableSignalKeyStore ,  MessageType,  Presence,  WA_MESSAGE_STUB_TYPES,  Mimetype,  relayWAMessage,	 Browsers,  GroupSettingChange,  delay,  DisconnectReason,  WASocket,  getStream,  WAProto,  isBaileys,  AnyMessageContent,  generateWAMessageFromContent, fetchLatestBaileysVersion,  processMessage,  processingMutex
} = require('@whiskeysockets/baileys');
const express = require("express");
let pino = require('pino')
const fs = require('fs')
const axios = require('axios');
const Pino = require('pino')
const cfonts = require('cfonts');
const chalk = require('chalk')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) };
const moment = require('moment-timezone');

const PhoneNumber = require('awesome-phonenumber')
let phoneNumber = "557792142954"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const NodeCache = require("node-cache")


const PORT = `8080`;
const app = express();
var donoName = 'pedrozz moddz'
var botName = 'teste bot'
var emoji = '💎'
var prefix = '¥'
var prefixo = prefix


//HORA E DATA DO BOT
const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss');
const date = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');
const data = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');

//MENSAGENS DE SAUDAÇÕES POR HORA
if(hora > "00:00:00"){
var timed = 'Boa Madrugada 🌆' 
} 
if(hora > "05:30:00"){
var timed = 'Bom Dia 🏙️' 
}
if(hora > "12:00:00"){
var timed = 'Boa Tarde 🌇' 
}
if(hora > "19:00:00"){
var timed = 'Boa Noite 🌃' 
}            

//BANNER DO CONSOLE

const banner2 = cfonts.render((`©2024 Copyright by Pedrozz_Mods`), {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']
});

console.log(banner2.string)
console.log(`
╭━┈────╌${botName}──╌──┈⊷
┃➤ 𝐂𝐑𝐈𝐀𝐃𝐎𝐑: 𝐏𝐄𝐃𝐑𝐎𝐙𝐙 𝐌𝐎𝐃𝐃𝐙
┃➤ 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌: 𝐏𝐄𝐃𝐑𝐎𝐙𝐙_𝟏𝟑𝟕𝟓𝟓
┃➤ 𝐁𝐎𝐓: ${botName}
┃➤ 𝐏𝐑𝐄𝐅𝐈𝐗𝐎 ( ${prefix} )
╰━╌──𝐏𝐄𝐃𝐑𝐎𝐙𝐙 𝐌𝐎𝐃𝐃𝐙🐦‍🔥──┈⊷
`)

async function ligarbot() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) })

const { state, saveCreds } = await useMultiFileAuthState('./dono/bot-qr')
const { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetryCounterCache = new NodeCache() // para mensagem de nova tentativa, "mensagem de espera"
const client = makeWASocket({
logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // aparecendo QR no log do terminal
      mobile: useMobile, // API móvel (propensa a banimentos)
      browser: ['Chrome (Linux)', '', ''], // para essas questões https://github.com/WhiskeySockets/Baileys/issues/328
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ['Chrome (Linux)', '', ''], // para essas questões https://github.com/WhiskeySockets/Baileys/issues/328
      markOnlineOnConnect: true, // definir false para off-line
      generateHighQualityLinkPreview: true, // criar link de visualização alto
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolver mensagens em espera
      defaultQueryTimeoutMs: undefined, // para essas questões https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(client.ev)

    // login usar cÃ³digo de pareamento
   // CÃ³digo fonte https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !client.authState.creds.registered) {
      if (useMobile) throw new Error('NÃ£o Ã© possÃ­vel usar o cÃ³digo de pareamento com a API mÃ³vel')

      let phoneNumber
      if (!!phoneNumber) {
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Comece com o cÃ³digo do paÃ­s do seu nÃºmero do WhatsApp, exemplo : +557792142954")
            process.exit(0)
         }
      } else {
         phoneNumber = await question(`Digite seu nÃºmero do WhatsApp \nPor exemplo: +557792142954: `)
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Pergunte novamente ao digitar o nÃºmero errado
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Comece com o cÃ³digo do paÃ­s do seu nÃºmero do WhatsApp, exemplo : +557792142954")

            phoneNumber = await question(`Digite seu nÃºmero do WhatsApp \nPor exemplo: +557792142954 : `)
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await client.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log((`Seu cÃ³digo de emparelhamento : `),(code))
      }, 3000)
   }
astaroth = client
client.ev.on('chats.set', () => {
console.log('setando conversas...')
})

client.ev.on('contacts.set', () => {
console.log('setando contatos...')
})

client.ev.on('creds.update', saveCreds)

client.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 

const key = {
    remoteJid: info.key.remoteJid,
    id: info.key.id, 
    participant: info.key.participant 
}
await client.readMessages([key])
if (info.key && info.key.remoteJid == 'status@broadcast') return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]

const from = info.key.remoteJid

//_-_-_-_-_-_-_-_-_-_-_-_-(INFOS)_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--\\\

function getGroupAdmins(participants) {
admins = []
for (let i of participants) {
if(i.admin == 'admin') admins.push(i.id)
if(i.admin == 'superadmin') admins.push(i.id)
}
return admins
}

const Random = Math.random(10)
const getExtension = async (type) => {
return await mimetype.extension(type)
}

const getFileBuffer = async (mediakey, MediaType) => { 
const stream = await downloadContentFromMessage(mediakey, MediaType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const getMembros = (participants) => {
admins = []
for (let i of participants) {
if(i.admin == null) admins.push(i.id)
}
return admins
}

const getBuffer = (url, options) => new Promise(async (resolve, reject) => { 
options ? options : {}
await axios({method: "get", url, headers: {"DNT": 1, "Upgrade-Insecure-Request": 1}, ...options, responseType: "arraybuffer"}).then((res) => {
resolve(res.data)
}).catch(reject)
})

/// ==============budy
const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''
var budy2 = budy.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
//==============(BODY)================\\

const body = type === "conversation" ? info.message.conversation : type === "viewOnceMessageV2" ? info.message.viewOnceMessageV2.message.imageMessage ? info.message.viewOnceMessageV2.message.imageMessage.caption : info.message.viewOnceMessageV2.message.videoMessage.caption : type === "imageMessage" ? info.message.imageMessage.caption : type === "videoMessage" ? info.message.videoMessage.caption : type === "extendedTextMessage" ? info.message.extendedTextMessage.text : type === "viewOnceMessage" ? info.message.viewOnceMessage.message.videoMessage ? info.message.viewOnceMessage.message.videoMessage.caption : info.message.viewOnceMessage.message.imageMessage.caption : type === "documentWithCaptionMessage" ? info.message.documentWithCaptionMessage.message.documentMessage.caption : type === "buttonsMessage" ? info.message.buttonsMessage.imageMessage.caption : type === "buttonsResponseMessage" ? info.message.buttonsResponseMessage.selectedButtonId : type === "listResponseMessage" ? info.message.listResponseMessage.singleSelectReply.selectedRowId : type === "templateButtonReplyMessage" ? info.message.templateButtonReplyMessage.selectedId : type === "groupInviteMessage" ? info.message.groupInviteMessage.caption : type === "pollCreationMessageV3" ? info.message.pollCreationMessageV3 : type === "interactiveResponseMessage" ? JSON.parse(info.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : type === "text" ? info.text : ""

var Procurar_String = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || ""

////========
var budy3 = budy.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
var PR_String = Procurar_String.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
const q_ofc = PR_String.trim().split(/ +/).slice(1).join(" ");

//CONSTS PRINCIPAIS DO BOT
const isGroup = from.endsWith('@g.us');
const content = JSON.stringify(info.message);
const criador = `556199317165@s.whatsapp.net`
const numeroBot = client.user.id.split(":")[0]+"@s.whatsapp.net"
const groupMetadata = isGroup ? await client.groupMetadata(from): ""
const participants = isGroup ? await groupMetadata.participants : ''
const groupName = isGroup  ? groupMetadata.subject: ""
const groupDesc = isGroup ? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(' ')
const sender = isGroup ? info.key.participant.includes(':') ? info.key.participant.split(':')[0] +'@s.whatsapp.net': info.key.participant : info.key.remoteJid;
const pushname = info.pushName ? info.pushName : ""
const argss = body.split(/ +/g)
const separar = body.trim().split(/ +/).slice(1)
const x = separar.join(' ')
const isGroupAdmins = groupAdmins.includes(sender) || false
const isAdm = groupAdmins.includes(sender) || false  
const isBot = info.key.fromMe ? true : false
const isBotGroupAdmins = groupAdmins.includes(numeroBot) || false
const isDono = criador.includes(sender)

const isCmd = body.startsWith(prefix)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null

var texto_exato = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

const texto = texto_exato.slice(0).trim().split(/ +/).shift().toLowerCase()

//SIMULA ESTÁ ESCREVENDO
async function escrever (texto) {
await client.sendPresenceUpdate('composing', from) 
await esperar(1000)   
client.sendMessage(from, { text: texto }, {quoted: info})
}

//SIMULA MANDAR AUDIO
async function mandarAudio (texto) {
client.sendPresenceUpdate('recording', from)
await esperar(1000)   
client.sendMessage(from, { text: texto }, {quoted: info})
}

//ENVIAR MENSAGEM 
const enviar = (texto) => {
client.sendMessage(from, { text: texto }, {quoted: info})
}

//DELAY ENTRE MENSAGEM 
const esperar = async (tempo) => {
    return new Promise(funcao => setTimeout(funcao, tempo));
}

//REAÇÃO DE MENSAGEM 
const reagir = (reassao) => {
client.sendMessage(from, {react: {text: reassao, key: info.key}})}

//SELO DO BOT
const selo = (texto) => {
return {key: {fromMe: false,participant: '0@s.whatsapp.net'},message: {
extendedTextMessage: {text: `${texto}`,title: null}}};};

//SELO CONTATO
const contato = {key : {participant : '0@s.whatsapp.net'},message: {contactMessage:{displayName: `${pushname}`}}}

//========[ MOSTRAR MENSAGEM NO TERMINAL ]=========\\

const tipoMensagem = type == 'audioMessage' ? 'Áudio' : type == 'stickerMessage' ? 'Figurinha' : type == 'imageMessage' ? 'Imagem' : type == 'videoMessage' ? 'Vídeo' : type == 'documentMessage' ? 'Documento' : type == 'contactMessage' ? 'Contato' : type == 'locationMessage' ? 'Localização' : budy


// 女⃟⃟女COMANDO NO PV女⃟⃟女
if (!isGroup && isCmd && !isBot) console.log(
color(' COMANDO NO PV ','red'),'\n',
color(`${emoji}ΝᏆᏟᏦ :`,'red'),color(pushname,'cyan'),'\n',
color(`${emoji}ΝႮ́ᎷᎬᎡϴ :`,'red'),color(sender.split("@")[0],'red'),'\n',
color(`${emoji}ᏟᎷᎠ :`,'red'),color(comando,'cyan'),'\n',
color(`${emoji}ᎻϴᎡᎪ :`,'red'),color(hora,'cyan'),'\n',)

// COMANDO NO GRUPO
if (isCmd && isGroup && !isBot) console.log(
color(' COMANDO NO GRUPO ','red'),'\n',
color(`${emoji}ᏀᎡႮᏢϴ :`,'red'),color(groupName,'red'),'\n',
color(`${emoji}ΝႮ́ᎷᎬᎡϴ :`,'red'),color(sender.split("@")[0],'red'),'\n',
color(`${emoji}ΝᏆᏟᏦ :`,'red'),color(pushname,'gold'),'\n',
color(`${emoji}ᏟᎷᎠ :`,'red'),color(comando,'gold'),'\n',
color(`${emoji}ᎻϴᎡᎪ :`,'red'),color(hora,'gold'),'\n',)

// MENSAGEM NO PV
if (!isCmd && !isGroup && !isBot) console.log(
color(' MENSAGEM NO PV ','red'),'\n',
color(`${emoji}ΝᎷᎬᎡϴ :`,'red'),color(sender.split("@")[0],'red'),'\n',
color(`${emoji}ΝᏆᏟᏦ :`,'red'),color(pushname,'cyan'),'\n',
color(`${emoji}ᎻϴᎡᎪ :`,'red'),color(hora,'cyan'),'\n',
color(`${emoji}MSG :`,'red'),color(tipoMensagem,'cyan'),'\n',)

// MENSAGEM NO GRUPO 
if (!isCmd && isGroup && !isBot) console.log(
color(' MENSAGEM NO GRUPO ','red'),'\n',
color(`${emoji}ᏀᎡႮᏢϴ :`,'red'),color(groupName,'cyan'),'\n',
color(`${emoji}ΝႮ́ᎷᎬᎡϴ :`,'red'),color(sender.split("@")[0],'red'),'\n',
color(`${emoji}ΝᏆᏟᏦ :`,'red'),color(pushname,'cyan'),'\n',
color(`${emoji}ᎻϴᎡᎪ :`,'red'),color(hora,'cyan'),'\n',
color(`${emoji}MSG :`,'red'),color(tipoMensagem,'cyan'),'\n',)

//REAÇÃO PV/GRUPO 
if (isGroup && info.message?.reactionMessage?.text) console.log(
color(' MENSAGEM NO GRUPO ','red'),'\n',
color(`${emoji}ᏀᎡႮᏢϴ :`,'red'),color(groupName,'cyan'),'\n',
color(`${emoji}ΝႮ́ᎷᎬᎡϴ :`,'red'),color(sender.split("@")[0],'red'),'\n',
color(`${emoji}ΝᏆᏟᏦ :`,'red'),color(pushname,'cyan'),'\n',
color(`${emoji}ᎻϴᎡᎪ :`,'red'),color(hora,'cyan'),'\n',
color(`${emoji}EMOJI : ( ${info.message.reactionMessage.text} )`, "red"),'\n',)

async function fetchJson (url, options) {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}
switch(comando) {
//cases ficam abaixo ðŸ‘‡
case 'escreva':
escrever('ear mano, de boa?')
break

case 'responda':
enviar('opa')
break


//cases ficam acima ðŸ‘†
default:
if(isCmd) {
client.sendMessage(from, {text: `
╭━─≪𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐈𝐍𝐄𝐗𝐈𝐒𝐓𝐄𝐍𝐓𝐄≫─━╮
│╭─────────────╮
││➥[ 👤 ] *OLÁ HUMANO:*
││➥[ 🙄 ] *ACHO QUE TE FALTA LER O MENU*
││➥[ 📄 ] *COMANDO:* *_${comando}_*
│╰─────────────╯
╰━──≪  ${donoName}  ≫─━━╯
`})
}
}
// IF ABAIXO ðŸ‘‡



//IF ACIMAðŸ‘†
} catch (erro) {
console.log(erro)
}})

client.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if(lastDisconnect === undefined) {

}

if(connection === 'close') {
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  
ligarbot()
}
if(update.isNewLogin) {
console.log(`conectado com sucesso`)
}})}
ligarbot()

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

fs.watchFile('./index.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log('A index foi editada, irei reiniciar...');
process.exit()
}
})

