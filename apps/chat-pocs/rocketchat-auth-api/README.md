# rocketchat-auth-api

# Vault steps

1. Install the `vault` CLI from https://developer.hashicorp.com/vault/install

- via homebrew, probably just works, if you already keep your homebrew up to date :)
- if you don't, the download is just a static binary and you can drop it in `/usr/local/bin` or similar for convenience.

2. Connect to VPN
3. Use the Okta method to login to our Vault instance at https://vault.core.redesignhealth.com
4. Select the person icon in the top of the left hand nav, then "copy token". You'll need this in step 6.
5. Open a new Terminal and tell Vault our instance address:

```
% export VAULT_ADDR=https://vault.core.redesignhealth.com
```

6. Login to Vault from this terminal. Paste the token from step 4 when prompted. You should see a success message.

```
% vault login
```

7. Finally, use the configured vault agent to append the `ROCKETCHAT_POC_CLIENT_ID` and `ROCKETCHAT_POC_CLIENT_SECRET` files to your `.env.local`.

```
% cd /apps/rocketchat-auth-api
% vault agent
```

8. Make sure those variables have been written to `.env.local`. You're done with Vault configuration and fetching of secrets!

# Other stuff

- Shouldn't be needed very often, but to generate `agent-config.hcl`:

```
% vault agent generate-config -type="env-template" -exec="./write-dotenv.sh" -path="developers/dev/rocketchat-poc" agent-config.hcl
```
