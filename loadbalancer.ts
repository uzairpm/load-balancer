const nodefetch = require('node-fetch');
var colors = require('colors');
const express = require('express');
const app = express();
const PORT = 80;
const HEALTH_CHECK_INTERVAL = 5000;


// let serverIdx = 0;
const masterServersList: any[] = ['http://localhost:8080/', 'http://localhost:8081/', 'http://localhost:8082/'];
let servers = [...masterServersList];

function getServerUrl(): string {
    // lets go round robin for now
    const chosen: any = servers.pop();
    servers.unshift(chosen);
    console.log('Chosen server', chosen);
    return chosen;
}

function performPeriodicHealthChecks() {
    // perform health check every 5 seconds
    servers = [...masterServersList];
    masterServersList.forEach(async (srv, idx) => {
        try {
            const url = srv + 'health';
            const response = await nodefetch(url);

            if (response && response.status === 200) {
                console.log(colors.green(`Server ${srv} is up and running`));
            } else {
                console.log(colors.red(`Server ${srv} is down`));
                servers = servers.filter(it => it !== srv);
            }
        } catch (err) {
            console.log(colors.red(`Server ${srv} is down`));
            servers = servers.filter(it => it !== srv);
        }
    });
}

setInterval(() => {
    performPeriodicHealthChecks();
}, HEALTH_CHECK_INTERVAL);

app.get('/', async (req: any, res: any) => {
    const timeReceived = new Date().toISOString();
    console.log(`Request received at ${timeReceived}`);

    try {
        const serverUrl = getServerUrl();
        const response = await nodefetch(serverUrl);
        const data = await response.json();
        res.json({
            lbMsg: `Load balancer at ${timeReceived}`,
            data
        });
    } catch (error) {
        console.error('An error occured', error);
        res.status(500).send('An error occured ' + error);
    }
});

app.get('/health', (req: any, res: any) => {
    const timeReceived = new Date().toISOString();
    console.log(`Health check received at ${timeReceived}`);
    res.send(`Load balancer is up and running ${timeReceived}`);
});

app.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
});