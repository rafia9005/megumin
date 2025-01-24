import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        version: version,
    });

    sock.ev.on('messages.upsert', async (event) => {
        for (const m of event.messages) {
          const text = m.message?.conversation?.toLowerCase()
          const sender = m.key.remoteJid;

          if(text?.startsWith('!menu')){
            await sock.sendMessage(sender!, {
              text: "hello world"
            })
          }
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

connectToWhatsApp().catch((err) => console.error('Error starting bot:', err));
