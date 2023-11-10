const nodefetch = require('node-fetch');
const express = require('express');
const app = express();
const port = 80;

const server1Url = 'http://localhost:8080/';
const server2Url = 'http://localhost:8081/';
const server3Url = 'http://localhost:8082/';

// let serverIdx = 0;
let servers: any[] = [server1Url, server2Url, server3Url];

function getServerUrl(): string {
    // lets go round robin for now
    const chosen: any = servers.pop();
    servers.unshift(chosen);
    console.log(chosen);
    return chosen;
}

app.get('/', async (req: any, res: any) => {
    const timeReceived = new Date().toISOString();
    console.log(`Request received at ${timeReceived}`);

    try {
        const serverUrl = getServerUrl();
        const response = await nodefetch(serverUrl);
        const data = await response.json();
        // const jsonString = JSON.stringify(data);
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
    console.log(`Request received at ${timeReceived}`);
    res.send(`Load balancer is up and running ${timeReceived}`);
});

app.listen(port, () => {
    console.log(`Load balancer listening on port ${port}`)
});