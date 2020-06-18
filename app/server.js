const url = require('url');
const http = require('http');
const view = require('./view')
const fs = require('fs')
const vault = require('./vault')


const MY_VARIABLE = process.env.MY_VARIABLE || 'Hello';

const VAULT_WRAP_TOKEN = process.env.VAULT_WRAP_TOKEN || null;
const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID || null;

let cssFile

fs.readFile(__dirname + '/style.css', function (err, data) {
    if (err) {
        throw err;
    }
    cssFile = data;
});

const handleRequest =
    async (req, res) => {
        console.log(req.url);
        switch (req.url) {
            case "/style.css" :
                res.writeHead(200, {"Content-Type": "text/css"});
                res.write(cssFile);
                break;
            default :
                let secrets
                try {
                    if (!process.env.VAULT_TOKEN) {
                        const unwrap = await vault.unwrapToken(VAULT_WRAP_TOKEN);
                        const auth = await vault.authLogin({secret_id: unwrap.data.secret_id, role_id: VAULT_ROLE_ID});
                        process.env.VAULT_TOKEN = auth.auth.client_token || null;

                    }
                    secrets = await vault.getVaultSecret(process.env.VAULT_TOKEN)
                } catch (e) {
                    console.log(e);
                }

                const queryObject = url.parse(req.url, true).query;
                const message = queryObject.user ? `${MY_VARIABLE} ${queryObject.user}` : `${MY_VARIABLE} Zenika`

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(view.display(
                    {message, wrap_token: VAULT_WRAP_TOKEN, client_token: process.env.VAULT_TOKEN, secrets}));
        }
        res.end();
    }

const PORT = process.env.PORT || 3000;

const app = http.createServer(handleRequest)
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});