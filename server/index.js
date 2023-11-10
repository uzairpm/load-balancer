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

app.listen(port, () => {
    console.log(`${serverName} listening on port ${port}`)
});