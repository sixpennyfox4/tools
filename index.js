const prompt = require('prompt-sync')();
const https = require('https');

const mainMSG = `
        ██     ██ ███████ ██████  ██   ██       ███████ ██████   █████  ███    ███ ███    ███ ███████ ██████  
        ██     ██ ██      ██   ██ ██   ██       ██      ██   ██ ██   ██ ████  ████ ████  ████ ██      ██   ██ 
        ██  █  ██ █████   ██████  ███████ █████ ███████ ██████  ███████ ██ ████ ██ ██ ████ ██ █████   ██████  
        ██ ███ ██ ██      ██   ██ ██   ██            ██ ██      ██   ██ ██  ██  ██ ██  ██  ██ ██      ██   ██ 
         ███ ███  ███████ ██████  ██   ██       ███████ ██      ██   ██ ██      ██ ██      ██ ███████ ██   ██ 
`

console.log(`\x1b[33m${mainMSG}\x1b[0m`);

const webHookUrl = prompt('Webhook url: ');
if (webHookUrl === '') {
    console.log('Please enter webhook url next time!');
    return;
}

const count = prompt('Count: ');
if (count === '') {
    console.log('Please enter count number next time!');
    return;
}

const msg = prompt('Message: ');
if (msg === '') {
    console.log('Please enter message next time!');
    return;
}
console.log();

const msgJson = JSON.stringify({ content: msg });

const url = new URL(webHookUrl);
const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(msgJson),
    }
};

let messageSent = 0;

function main() {
    if (messageSent >= count) {
        console.log('All messages sent!');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        console.log('\nPress any key to exit...');

        process.stdin.on('data', () => {
            console.log('\nExiting...');
            process.exit();
        });

        return;
    }

    const req = https.request(options, (res) => {
        let data = '';
    
        res.on('data', (chunck) => {
            data += chunck;
        });
    
        res.on('end', () => {
            if (res.statusCode === 429) {
                const retryAfter = res.headers['retry-after'] ? parseInt(res.headers['retry-after']) : 1000;
                console.log(`Rate limited! Retrying after ${retryAfter}ms...`);

                setTimeout(main, retryAfter);
            } else {
                if (data === '') {
                    console.log('Message Sent!');
                } else {
                    console.log(data);
                }

                messageSent++;
                setTimeout(main, 250);
            }
        });

        res.on('error', (e) => {
            console.log(e.message);
        })
    })

    req.write(msgJson);
    req.end();
}

main()