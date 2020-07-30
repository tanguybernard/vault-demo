# Demo

## 1. Up container

Db first

    dco down && dco build && dco up -d db
    
And Vault
    
    dco up -d vault
    
    
NB: remove data directory if you want to init again the vault    

## 2. Inside container

    docker exec -it vaultserver /bin/sh

## 3. Initialization       

With some options

    vault operator init  -key-shares=3 -key-threshold=2
        
key-shares: Number of key generated

key-threshold: Number of key required to unseal the master


## 4.  Unseal

    vault operator unseal <UNSEAL KEY>

## 5. Signin with Token
      
      vault login  <Token>
      
## 6. Create path for secret

    vault secrets enable -path=secret/back kv
    
When running v2 of the kv backend a key can retain a configurable number of versions.   

Ex migration with encryption key, and there a problem you can retrieve the old encryption key

Source: https://www.vaultproject.io/docs/secrets/kv
      
## 7.Write a secret

    vault write secret/back/demo mysql_pass=1234 mysql_user=toto super_service_key=dfd4jdfjn5ZuGpo

## 8. Read Secret

    vault read secret/back/demo

## 9. Create a policy for demo app

    vault policy write demopolicy policies/policy_demo.hcl

## 10. Create a policy to read role id (ex: Jenkins) (te: trusted entity)

    vault policy write te_role_id policies/policy_trusted_entity_role_id.hcl

## 11. Create a policy secret id

    vault policy write te_secret_id policies/policy_trusted_entity_secret_id.hcl

## 12. Enable approle, allows machines or apps to authenticate with Vault-defined roles.

    vault auth enable approle

## 13 Create approle for demo application

    vault write auth/approle/role/demo-app-role \
        policies="default","demopolicy"

>> many options are available

https://www.vaultproject.io/docs/auth/approle

## 14. Create a token for Jenkins
      
    vault token create -policy=te_role_id -display-name=Jenkins
    
>> Best practice it's renew the token (maybe with cron)   

## 15. Lookup

    vault token lookup <token>

## 16. Create Token for ansible, kubernetes...

    vault token create -policy=te_secret_id -display-name=Ansible
    
## 17. Get role id for jenkins    
    
    curl --header "X-Vault-Token: <TOKEN>" http://127.0.0.1:8200/v1/auth/approle/role/demo-app-role/role-id

>> If you want you can make a cron to renew the token (and do not create a new one for each deployment) and use it to get role id

## 18. Create wrapped token to get secret id

    curl --header "X-Vault-Token: s.m3SSKYBl6NBgX55eOuIrK9Ep" -H "x-vault-wrap-ttl: 600" --request POST http://127.0.0.1:8200/v1/auth/approle/role/demo-app-role/secret-id

ttl: 600 secondes, be carreful, on the demo to unwarp quickly

Wrapped token , not directly secret_id to avoid an attacker to use secret to create token for himself


>> Response

> {"request_id":"","lease_id":"","renewable":false,"lease_duration":0,"data":null,"wrap_info":{"token":"s.mh056fFJYzWyU3e3FfROzCyV","accessor":"aUTfWQyf1IrcFG07M4ZqM1mM","ttl":60,"creation_time":"2020-05-01T10:16:10.795959386Z","creation_path":"auth/approle/role/demo-app-role/secret-id"},"warnings":null,"auth":null}


## 19. Use Wrap Token (strategy startup application)

    PORT=3001 VAULT_WRAP_TOKEN=s.xU3K22N6D3m2TbqU5LeGHU2T VAULT_ROLE_ID=32d9474b-7f51-f700-53fe-65f4a5f1d6c8 node app/server.js

## 20. Or use Client Token (strategy, use token for every connection to the plateform)

    PORT=3001 VAULT_TOKEN=s.PGeQr4tNjCgIZuyNpHa1NnJn node app/server.js
