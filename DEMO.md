

## 1. Up container

    docker-compose up

## 2. Inside container

    docker exec -it vaultserver /bin/sh

## 3. Initialization       

With some options

    vault operator init  -key-shares=3 -key-threshold=2
        
key-shares: Number of key generated

key-threshold: Number of key required to unseal the master


## 4.  Unseal

    vault operator unseal

## 5. Signin with Token
      
      vault login  <Token>
      
## 6. Create path for secret

    vault secrets enable -address=http://127.0.0.1:8200 -path=secret_team_back kv   
      
## 7.Write a secret

    vault write secret_team_back/demo mot_de_passe=1234

## 8. Read Secret

    vault read secret_team_back/demo

## 9. Create a policy to read role id

    vault policy write te_role_id policies/policy_trusted_entity_role_id.hcl

## 10. Create a policy secret  id

    vault policy write te_secret_id policies/policy_trusted_entity_secret_id.hcl

## 11. Create a policy for demo app

    vault policy write demopolicy policies/policy_demo.hcl

## 10. Enable approle, allows machines or apps to authenticate with Vault-defined roles.

    vault auth enable approle
    

## 11 Create approle for demo application

    vault write auth/approle/role/demo-app-role \
        secret_id_ttl=10m \
        token_num_uses=10 \
        token_ttl=20m \
        token_max_ttl=30m \
        secret_id_num_uses=40 \
        policies="default","demopolicy"


https://www.vaultproject.io/docs/auth/approle

## 12. Create a token for Jnekins
      
    vault token create -policy=te_role_id -display-name=Jenkins

## 13. Lookup

    vault token lookup <token>

## 14. Create Token for ansible, kubernets...

    vault token create -policy=te_secret_id -display-name=Ansible
       
## 15. Get Info Role id with Jenkins

    curl --header "X-Vault-Token: <TOKEN>" http://127.0.0.1:8200/v1/auth/approle/role/demo-app-role
    
## 16. Get role id for jenkins    
    
    curl --header "X-Vault-Token: <TOKEN>" http://127.0.0.1:8200/v1/auth/approle/role/demo-app-role/role-id

## 17. Create secret id

    curl --header "X-Vault-Token: <token>" --request POST http://127.0.0.1:8200/v1/auth/approle/role/demo--role/secret-id

## 17. Create wrapped token 

    curl --header "X-Vault-Token: s.m3SSKYBl6NBgX55eOuIrK9Ep" -H "x-vault-wrap-ttl: 60" --request POST http://127.0.0.1:8200/v1/auth/approle/role/demo-app-role/secret-id

ttl: 60 secondes, be carreful, on the demo to unwarp quickly


>> REsponse

> {"request_id":"","lease_id":"","renewable":false,"lease_duration":0,"data":null,"wrap_info":{"token":"s.mh056fFJYzWyU3e3FfROzCyV","accessor":"aUTfWQyf1IrcFG07M4ZqM1mM","ttl":60,"creation_time":"2020-05-01T10:16:10.795959386Z","creation_path":"auth/approle/role/demo-app-role/secret-id"},"warnings":null,"auth":null}




## 18. Unwarp token, inside data put the wrapped token

curl --header "X-Vault-Token: s.mh056fFJYzWyU3e3FfROzCyV" --request POST http://127.0.0.1:8200/v1/sys/wrapping/unwrap


##19. Login and get client_token

curl --data '{"role_id": "fb93d379-e995-a947-d41f-c1bf94b2ccd9", "secret_id": "4321d21b-5476-d9f0-779c-ba0a73d9d73c" }' http://127.0.0.1:8200/v1/auth/approle/login
 

##20. Get Secret

curl -H "X-Vault-Token: <token>" -X GET  http://127.0.0.1:8200/v1/secret/secret_team_back/demo

## Un peu plus loin 

PORT=3001 node app/server.js


L'exemple suivant permet d'afficher les processus des autres utilisateurs de façon descendante en affichant les noms des utilisateurs sur des processus n'ayant pas de terminal (comme apache par exemple) :


ps faux | grep 'your_process'

ps faux | grep node

strings /proc/<procID>/environ



vault token revoke
