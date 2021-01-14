// Minecraft bot
const mineflayer = require('mineflayer')
const Item = require('prismarine-item')('1.13.2')

// Discord bot
const Discord = require('discord.js');
const {MessageEmbed, Collection} = require("discord.js")
const client = new Discord.Client();
client.setMaxListeners(50)

// Console colors
const chalk = require("chalk")

// Yaml
const {readdirSync, readFileSync, writeFileSync} = require("fs")
const yaml = require("js-yaml")

// Console read text
var readline = require("readline");
var rl = readline.createInterface(process.stdin);

// Admins usernames
var adminsUsernames = {
    wlasciciele: ["EsqL", "Morkazoid"],
    pomocnicy: ["Piter26", "TBone151219", "MrSebastian", "Rexks", "kjbiskupscy", "Bella"],
    tutorzy: ["ExIsT", "ilUnicornli", "Jikazuki", "Marta527", "_Shizouh"],
    straznicy: ["Aivix", "LadyAnieQ", "Pawel654", "siwerek2", "X_MrJohn_X", "zlotan"],
    czatownicy: []
}

// Load config
const configFile = readFileSync(__dirname + `/../config.yaml`, "utf8");
const userConfig = yaml.load(configFile);

// Config check
const ConfigCheck = require(__dirname + "/configCheck.js")
ConfigCheck(userConfig)


// Discord webhooks
const { Webhook, MessageBuilder } = require('discord-webhook-node');
let hook;
if (userConfig.discordConnection.enable) {
    hook = new Webhook(userConfig.discordConnection.webhookURL);
    hook.setUsername(userConfig.discordConnection.webhookName)
    hook.setAvatar(userConfig.discordConnection.webhookIconURL)
}

function HookSend(msg) {
    if (userConfig.discordConnection.enable) {
        hook.send(msg).then().catch(err => {
            console.log("Wystąpił błąd przy wysłaniu wiadomości przez webhooka")
        })
    }
}


//Zmienne
let zalogowany = false;
let wWyborzeTrybu = false;
let naTrybie = false;
let logowanie = false
let autologin = false;
let sendMsgToWebhook = false

// Creating minecraft bot
let bot;
function CreateBot() {
    bot = mineflayer.createBot({
        host: "gc2.pl",
        port: 25565,
        username: userConfig.username,
        version: false
    })
    
    zalogowany = false;
    wWyborzeTrybu = false;
    naTrybie = false;
    logowanie = false
    autologin = false;
    sendMsgToWebhook = false
    
    bot.on('message', function (message) {
        var msg = (!message.text && message.extra ? message.extra.map(msg => msg.text).join("") : message.text)
        
        console.log(message.toAnsi())
        // console.log(msg)
        if (sendMsgToWebhook) HookSend(`\`\`\`yaml\n${msg}\`\`\``)
    
        if (!zalogowany) {
            if (msg.includes("[GC2] Twoja nazwa jest zarejestrowana.")) {
                logowanie = true
                bot.chat(`/l ${userConfig.password}`)
            } else if (msg.includes("Zostałeś zalogowany automatycznie! Autologi")) {
                autologin = true
            }
        }
    
        if (!zalogowany) {
            if (msg.includes("[GC2] Zalogowałeś się!")) {
                zalogowany = true
            }
        }
    })
    
    
    bot.on("login", () => {
        if (!zalogowany) {
            console.log(chalk.magentaBright(`Zalogowano na serwer jako ${bot.username} na wersji ${bot.version}`))
        }
    
        if (naTrybie) {
            setTimeout(() => {
                sendMsgToWebhook = true
                var i = 0
                for (let cmd of userConfig.commands) {
                    i++
                    setTimeout(() => {
                        bot.chat(cmd)
                    }, i * 500);
                }
    
                if (userConfig.autoMount) {
                    setTimeout(() => {
                        //Wejście do wagonika
                        let entity = bot.nearestEntity((entity) => { return entity.type === 'object' })
                        if (entity) {
                            var i = 0
                            setInterval(() => {
                                i++
                                if (i > 30) return
                                bot.mount(entity)
                            }, 500);
                        } else {
                            console.log(chalk.red("Brak wagonika"))
                        }
                    }, 3000 + (userConfig.commands.length * 600));
                }

                if (userConfig.antyKick) {
                    setTimeout(() => {
                        bot.setQuickBarSlot(8)
                        setInterval(() => {
                            bot.activateItem(false)
                        }, 5 * 60 * 1000);
                    }, 6000);
                }
            }, 3000);
        }
    })
    
    rl.on("line", (text) => {
        if (text.startsWith("-")) {
            DoCommand(text.slice(1, text.length))
        } else {
            bot.chat(text)
        }
    })
    
    // Kicks
    bot.on('kicked', (reason, loggedIn) => {
        naTrybie = false
        var json = JSON.parse(reason)
        var powod = (!json.text ? json.extra.map(msg => msg.text).join("") : json.text)
        console.log(`Kick: ${powod}`)
        if (powod == "Zostałeś wyrzucony z serwera za nie ruszanie się przez więcej niż 6 minut.") {
            if (userConfig.antyKick) {
                CreateBot()
            }
        } else if (powod.includes("Disconnected")) {
            setTimeout(() => {
                CreateBot()
            }, 20 * 60 * 1000);
        } else if (powod.includes("[Proxy] Proxy restarting.")) {
            setTimeout(() => {
                CreateBot()
            }, 20 * 60 * 1000);
        } else if (powod.includes("Serwer w trakcie restartu!")) {
            setTimeout(() => {
                CreateBot()
            }, 10 * 60 * 1000);
        } else if (powod.includes("Zostałeś wyrzucony z serwera.")) {
            setTimeout(() => {
                CreateBot()
            }, 2 * 60 * 1000);
        } else if (powod.includes("Wykryto ogromną ilość połączeń, spróbuj za kilka minut!")) {
            setTimeout(() => {
                CreateBot()
            }, 1 * 30 * 1000);
        } else {
            if (userConfig.discordConnection.enable) {
                HookSend(`Kick - \`${powod}\``)
            }
    
            setTimeout(() => {
                CreateBot()
            }, 5 * 60 * 1000);
        }
    })
    bot.on('error', err => {
        console.log(err)
        if (err.message == "ETIMEDOUT") {
            setTimeout(() => {
                CreateBot()
            }, 1 * 30 * 1000);
        } else {
            setTimeout(() => {
                bot.end()
                CreateBot()
            }, 1 * 60 * 1000);
        }
        
    })
    
    bot.on("windowOpen", async (window) => {
        if (!zalogowany && logowanie && !autologin && userConfig.pin) {
            var pinStr = userConfig.pin.split("")
            var pin = []
            for (let cyfra of pinStr) {
                var cyfr
                if (cyfra == "1") cyfr = "3"
                if (cyfra == "2") cyfr = "4"
                if (cyfra == "3") cyfr = "5"
                if (cyfra == "4") cyfr = "12"
                if (cyfra == "5") cyfr = "13"
                if (cyfra == "6") cyfr = "14"
                if (cyfra == "7") cyfr = "21"
                if (cyfra == "8") cyfr = "22"
                if (cyfra == "9") cyfr = "23"

                pin.push(parseInt(cyfr))
            }
            setTimeout(async () => {
                var i = 0
                for (let cyfra of pin) {
                    i++
                    setTimeout(() => {
                        bot.clickWindow(cyfra, 0, 0)
                    }, i * 100);
                }
                setTimeout(() => {
                    bot.clickWindow(30, 0, 0)
                }, 1000);
            }, 500);
        }
    })
    
    var podTryby = false
    var tryb = userConfig.tryb
    if (tryb.startsWith("sb") || tryb.startsWith("mb")) podTryby = true

    bot.on("windowOpen", async (window) => {
        if ((zalogowany || autologin) || (!zalogowany && !logowanie && !autologin)) {
            if (!wWyborzeTrybu) {
                var slotToClick = 0
                if (tryb.startsWith("sb")) slotToClick = 11
                if (tryb.startsWith("mb")) slotToClick = 15
                if (tryb == "lb") slotToClick = 21
                if (tryb == "sea") slotToClick = 13
                if (tryb == "cr") slotToClick = 19
                if (tryb == "pvp") slotToClick = 23
                setTimeout(async () => {
                    bot.clickWindow(slotToClick, 0, 0)
                    wWyborzeTrybu = true
                }, 400);
            } else if (wWyborzeTrybu && !naTrybie && podTryby) {
                var slotToClick = 0
                if (tryb == "sb1") slotToClick = 12
                if (tryb == "sb2") slotToClick = 13
                if (tryb == "sb3") slotToClick = 14
                if (tryb == "sb4") slotToClick = 21
                if (tryb == "mb1") slotToClick = 12
                if (tryb == "mb2") slotToClick = 14
                setTimeout(async () => {
                    bot.clickWindow(slotToClick, 0, 0)
                    naTrybie = true
                }, 400);
            }
        }
    })
    
    function itemByName (name) {
        return bot.inventory.items().filter(item => item.name === name)[0]
    }
    
    function sayItems (items = bot.inventory.items()) {
        const output = items.map(itemToString).join(', ')
        if (output) {
            console.log(output)
        } else {
            console.log('empty')
        }
    }
    
    function itemToString (item) {
        if (item) {
            return `${item.displayName} x ${item.count}`
        } else {
            return '(nothing)'
        }
    }
    
}

CreateBot()

// Bot commands
function DoCommand (command) {
    const args = command.split(" ")
    const cmd = args.shift()

    switch (cmd) {
        case 'forward':
            bot.setControlState('forward', true)
            break
        case 'back':
            bot.setControlState('back', true)
            break
        case 'left':
            bot.setControlState('left', true)
            break
        case 'right':
            bot.setControlState('right', true)
            break
        case 'sprint':
            bot.setControlState('sprint', true)
            break
        case 'stop':
            bot.clearControlStates()
            break
        case 'relog':
            bot.end()
            CreateBot()
            console.log("Bot w trakcie relogu!")
            HookSend("Bot w trakcie relogu!")
            break
        case 'disconnect':
            bot.end()
            console.log("Bot wyszedł z serwera!")
            HookSend("Bot wyszedł z serwera!")
            break
        case 'connect':
            CreateBot()
            console.log("Bot w trakcie łączenia się z serwerem!")
            HookSend("Bot w trakcie łączenia się z serwerem!")
            break
        case 'jump':
            bot.setControlState('jump', true)
            bot.setControlState('jump', false)
            break
        case 'jumping':
            bot.setControlState('jump', true)
            break
        case 'stop-jumping':
            bot.setControlState('jump', false)
            break
        case 'attack':
            entity = bot.nearestEntity()
            if (entity) {
                bot.attack(entity, true)
            } else {
                bot.chat('no nearby entities')
            }
            break
        case 'mount':
            entity = bot.nearestEntity((entity) => { return entity.type === 'object' })
            if (entity) {
                bot.mount(entity)
                console.log("Wszedłem!")
            } else {
                // bot.chat('no nearby objects')
                console.log("Brak najbliższych pojazdów")
            }
            break
        case 'dismount':
            try {
                bot.dismount()
            } catch {
                console.log("Coś poszło nie tak")
            }
            break
        case 'mv-forward':
            bot.moveVehicle(0.0, 1.0)
            break
        case 'mv-backward':
            bot.moveVehicle(0.0, -1.0)
            break
        case 'mv-left':
            bot.moveVehicle(1.0, 0.0)
            break
        case 'mv-right':
            bot.moveVehicle(-1.0, 0.0)
            break
        case 'pos':
            console.log(bot.entity.position.toString())
            break
      }
}

if (userConfig.discordConnection.enable) {
    client.on('ready', () => {
        console.log(chalk.yellow(`Discord bot się zalogował jako ${client.user.tag}!`));
    });
    
    client.on('message', msg => {
        const {channel, guild, author, content} = msg
    
        var config = userConfig.discordConnection
    
        if (!naTrybie) return
    
        if (guild.id != config.serverID) return
        if (channel.id != config.channelID) return
        if (!author) return
        if (author.id != config.ownerID) return
    
        if (content.startsWith("-")) {
            DoCommand(content.slice(1, content.length))
        } else {
            bot.chat(content)
        }
    });
    
    client.login(userConfig.discordConnection.botToken);
    client.on("error", () => {})
}