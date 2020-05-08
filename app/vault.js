var request = require('request-promise');

const URL = 'http://127.0.0.1:8200'

module.exports.authLogin =  async function authLogin(body) {

    const options = {
        url: `${URL}/v1/auth/approle/login`,
        json: true,
        body
    };
    return request.post(options);
}

module.exports.getVaultSecret = async function getVaultSecret(token) {

    const options = {
        url: `${URL}/v1/secret/back/demo`,
        json: true,
        headers: {
            'X-Vault-Token': token
        }
    };
    return request.get(options);
}

module.exports.unwrapToken =  async function unwrapToken(token) {
    const options = {
        url: `${URL}/v1/sys/wrapping/unwrap`,
        json: true,
        headers: {
            'X-Vault-Token': token
        }
    };
    return request.post(options);
}