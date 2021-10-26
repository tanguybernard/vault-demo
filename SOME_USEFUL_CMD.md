# WORK IN PROGRESS

## Vault Commands

Outside container, you can use:

    docker exec -it vaultserver <cmd>
   
### Initilize Vault
    
    docker exec -it vaultserver vault operator init -address=http://127.0.0.1:8200

or directly inside

    vault operator init
    
### Unseal Vault (by default, configured with 3 unseal key, so 3 times)

    vault operator unseal <Unseal key>    

### Signin with Token

    vault login  <Token>
        
- Initial Root Token for the first time
- Next, create a token, and signin with him

NB: To use the policy, create a token and assign it to that policy
    
### Enable new path with key/value secret

    vault secrets enable -path=secret/backend kv    

kv: for Key/Value

### List secrets path

    vault secrets list   
    
### Write a secret (Json file)

    vault write secret/weatherapp/config "@/config/sample.json"

### Read secret

    vault read secret/weatherapp/config
    
### Check format of policy

    vault policy fmt my-policy.hcl    
    
### Import a policy 

    vault policy write -address=http://127.0.0.1:8200  weatherapp policies/policy.hcl    
    
ex: wheatherapp it's the name of policy with policies/policy.hcl conf

    
### Create a token (period=30m: duration 30m)

    vault token create -period=30m -policy=my-policy -policy=other-policy

### Accessor Token Lookup and revoke

When tokens are created, a token accessor is also created and returned. This accessor is a value that acts as a reference to a token and can only be used to perform limited actions:

- Look up a token's properties (not including the actual token ID)
- Look up a token's capabilities on a path
- Renew the token
- Revoke the token


    vault token lookup -accessor <token>

    vault token revoke -accessor <token>


## Curl

#### Get secret

    curl -H "X-Vault-Token: <token>" -X GET  http://127.0.0.1:8200/v1/secret/weatherapp/config

__(UPDATE)__

    curl -H "X-Vault-Token: <token>" -X GET  http://127.0.0.1:8200/v1/secret/data/weatherapp/config

#### Post secret

    curl --header "X-Vault-Token: ..." --request POST --data @payload.json https://127.0.0.1:8200/v1/secret/my-secret

#### Renew Token

    curl -X POST -H "X-Vault-Token: <token>" http://127.0.0.1:8200/v1/auth/token/renew-self

#### Check the TTL Token using the following request

    curl -X POST -H "X-Vault-Token: <token>" http://127.0.0.1:8200/v1/auth/token/lookup-self


## Credits

http://taswar.zeytinsoft.com/using-hashicorp-vault-for-nodejs-application-to-store-secrets/    

https://www.lighthousecs.com/blog/managing-secrets-with-hashicorp-vault
