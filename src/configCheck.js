// Console colors
const chalk = require("chalk")

module.exports = config => {
    var configErrors = 0
    function ConfigLog(msg) {
        console.log(chalk.red("[Config] ") + chalk.redBright(msg))
    }


    /////////////// Username
    if (!config.username) {
        ConfigLog("Brak podanej nazwy użytkownika!")
        configErrors++
    } else {
        // Username length
        if (config.username.length > 16) {
            ConfigLog("Nazwa użytkownika jest dłuższa niż 16 znaków!")
            configErrors++
        }

        if (config.username.length < 3) {
            ConfigLog("Nazwa użytkownika jest krótsza niż 3 znaki!")
            configErrors++
        }

        // Username chars
        var allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_".split('')
        var usernameToChars = config.username.split("")

        for (let usernameChar of usernameToChars) {
            var allowedCharCheck = false
            allowedChars.forEach(allowedChar => {
                if (usernameChar == allowedChar) allowedCharCheck = true
            });

            if (!allowedCharCheck) {
                ConfigLog("Nazwa użytkownika zawiera niedozwolone znaki!")
                configErrors++
                break
            }
        }
    }

    //////////// Password
    if (!config.password) {
        ConfigLog("Hasło do konta nie zostało podane!")
        configErrors++
    } else {
        if (config.password.includes(" ")) {
            ConfigLog("Hasło nie może zawierać spacji!")
        }
    }

    ///////////// Pin
    if (config.pin && config.pin.length > 0) {
        if (isNaN(parseInt(config.pin))) {
            ConfigLog("Pin może składać się tylko z cyfr!")
            configErrors++
        }
        if (config.pin.length > 4) {
            ConfigLog("Pin musi zawierać 4 cyfry!")
            configErrors++
        }
        if (config.pin.length < 4) {
            ConfigLog("Pin musi zawierać 4 cyfry!")
            configErrors++
        }
    }

    ///////////// Tryby
    var avaiable = [
        "sb1", "sb2", "sb3",
        "sb4", "mb1", "mb2",
        "lb", "sea", "pvp",
        "cr"
    ]

    if (!avaiable.includes(config.tryb)) {
        ConfigLog("Podany tryb jest nieprawidłowy!")
        configErrors++
    }


    //////// Discord connection
    if (config.discordConnection.enable) {
        // Bot token
        if (!config.discordConnection.botToken) {
            ConfigLog("Brak podanego tokenu do Discordowego bota!")
            configErrors++
        } else {
            // Token length
            if (config.discordConnection.botToken.length < 50) {
                ConfigLog("Podany token do Discordowego bota jest nieprawidłowy!")
                configErrors++
            }

            if (config.discordConnection.botToken.length > 70) {
                ConfigLog("Podany token do Discordowego bota jest nieprawidłowy!")
                configErrors++
            }
        }

        // Webhook
        if (!config.discordConnection.webhookURL) {
            ConfigLog("Brak podanego adresu URL do webhooka!")
            configErrors++
        } else {
            if (!config.discordConnection.webhookURL.includes("https://discord.com/api/webhooks")) {
                ConfigLog("Podany adres URL webhooka jest niepoprawny!")
                configErrors++
            }
        }

        // Owner ID
        if (!config.discordConnection.ownerID) {
            ConfigLog("Brak podanego ID konta właściciela na Discordzie!")
            configErrors++
        } else {
            if (isNaN(parseInt(config.discordConnection.ownerID))) {
                ConfigLog("Podane ID konta właściciela na Discordzie jest niepoprawne!")
                configErrors++
            }
        }

        // Channel ID
        if (!config.discordConnection.channelID) {
            ConfigLog("Brak podanego ID kanału na Discordzie!")
            configErrors++
        } else {
            if (isNaN(parseInt(config.discordConnection.channelID))) {
                ConfigLog("Podane ID kanału na Discordzie jest niepoprawne!")
                configErrors++
            }
        }

        // Guild ID
        if (!config.discordConnection.serverID) {
            ConfigLog("Brak podanego ID serwera na Discordzie!")
            configErrors++
        } else {
            if (isNaN(parseInt(config.discordConnection.serverID))) {
                ConfigLog("Podane ID serwera na Discordzie jest niepoprawne!")
                configErrors++
            }
        }
    }

    if (configErrors > 0) {
        ConfigLog("Znalezionych błędów w konfiguracji: " + configErrors)
        process.exit()
    } else {
        console.log(chalk.blue("[Config] ") + chalk.blueBright("Nieznaleziono żadnych błędów w konfiguracji!"))
    }
}