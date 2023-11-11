const express = require('express');
const app = express();
const port = process.argv[2] || 8080;

const serverName = `App server ${port}`;
app.get('/', (req, res) => {
    const timeReceived = new Date().toISOString();
    res.json({
        msg: `${serverName} payload`,
        ts: timeReceived
    });
});

app.get('/health', (req, res) => {
    const timeReceived = new Date().toISOString();
    console.log(`Health check received at ${timeReceived}`);
    res.status(200).send(`${serverName} is up and running ${timeReceived}`);
});

app.listen(port, () => {
    console.log(`${serverName} listening on port ${port}`)
});