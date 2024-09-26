const { Client, GatewayIntentBits } = require('discord.js');
const prompt = require('prompt-sync')();

const mainMSG = `
            ██████  ███    ███       ███████ ██████   █████  ███    ███ ███    ███ ███████ ██████  
            ██   ██ ████  ████       ██      ██   ██ ██   ██ ████  ████ ████  ████ ██      ██   ██ 
            ██   ██ ██ ████ ██ █████ ███████ ██████  ███████ ██ ████ ██ ██ ████ ██ █████   ██████  
            ██   ██ ██  ██  ██            ██ ██      ██   ██ ██  ██  ██ ██  ██  ██ ██      ██   ██ 
            ██████  ██      ██       ███████ ██      ██   ██ ██      ██ ██      ██ ███████ ██   ██ 
`

console.log(`\x1b[34m${mainMSG}\x1b[0m`);

const botToken = prompt('Bot Token: ');
const userID = prompt('User Id: ');
const count = prompt('Count: ');
const MSG = prompt('Message: ');

console.log();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
    partials: ['CHANNEL']
});

let messagesSend = 0;

client.on('ready', () => {
    main();
});

async function main() {
    if (messagesSend >= count) {
        console.log('All Messages Sent!');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        console.log('\nPress any key to exit...');

        process.stdin.on('data', () => {
            console.log('\nExiting...');
            process.exit();
        });

        return;
    };

    try {
        const user = await client.users.fetch(userID);

        user.send(MSG);
		
        console.log('Message Sent!');
        messagesSend++;
		
        setTimeout(main, 250);
    } catch (error) {
        console.log(`Error Sending Message: ${error}`);
    }
}

client.login(botToken);