
# Let's go

## Run yours containers

    docker-compose up
    
If something goes wrong: 

    rm -Rf data/*
    docker-compose stop
    docker-compose rm

### Go Inside Container

    docker exec -it vaultserver /bin/sh
   
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
    
### Enable new path

    docker exec -it vaultserver vault secrets enable -address=http://127.0.0.1:8200 -path=kv kv
    docker exec -it vaultserver vault secrets enable -address=http://127.0.0.1:8200 -path=secret kv    

kv: for Key/Value

### List secrets

    docker exec -it vaultserver vault secrets list -address=http://127.0.0.1:8200    
    
### Write a secret (Json file)

    docker exec -it vaultserver vault write -address=http://127.0.0.1:8200 secret/weatherapp/config "@/config/sample.json"

### Read secret

    docker exec -it vaultserver vault read -address=http://127.0.0.1:8200 secret/weatherapp/config
    
# Check format of policy

    vault policy fmt my-policy.hcl    
    
### Import a policy 

    docker exec -it vaultserver vault policy write -address=http://127.0.0.1:8200  weatherapp policies/policy.hcl    
    
ex: wheatherapp it's the name of policy with policies/policy.hcl conf

    
### Create a token

    vault token create -period=30m -policy=my-policy -policy=other-policy

### Curl

#### Get secret

    curl -H "X-Vault-Token: <token>" -X GET  http://127.0.0.1:8200/v1/secret/weatherapp/config

#### Post secret (à tester http ou https ? Policy ? ....)

    curl --header "X-Vault-Token: ..." --request POST --data @payload.json https://127.0.0.1:8200/v1/secret/my-secret

#### Renew Token (ex: period=30m, the token will be renewed for 30min again)

    curl -X POST -H "X-Vault-Token: <token>" http://127.0.0.1:8200/v1/auth/token/renew-self

#### Check the TTL Token using the following request

    curl -X POST -H "X-Vault-Token: s.Qt3VFkb5ndv7IeegJwLsepD6" http://127.0.0.1:8200/v1/auth/token/lookup-self


## Credits

http://taswar.zeytinsoft.com/using-hashicorp-vault-for-nodejs-application-to-store-secrets/    

https://www.lighthousecs.com/blog/managing-secrets-with-hashicorp-vault