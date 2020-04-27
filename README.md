
# CodeWizardsHQ Verification Bot

This bot is developed and maintained for the CodeWizardsHQ Discord by Razboy20.  

## To Install

To install, first clone the repository, then create a file `.env` in the directory. Then, the .env file should include the following filled out:

```pf
GUILD_ID=""
GIVE_ROLE_NAME=""
REMOVE_ROLE_NAME=""
VERIFY_CHANNEL_NAME=""
SECRET_TOKEN=""
APPLICATION_SECRET=""
APPLICATION_ID=""
PERSPECTIVE_API_KEY=""

PORT=""
HTTPS_KEY=""
HTTPS_CERT=""
```

This allows the bot to know what to do.

## Addons

Currently, the bot has the ability to support addons, and to create one, first take a look at the `example.js` addon, then if you create an addon, you can create your own reposity and add a pull request to the Addon branch of this repository.

### The list of current addons include

- Profanity Filter
