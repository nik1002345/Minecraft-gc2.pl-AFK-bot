# Minecraftowy bot do AFK na gc2.pl

## Opis

Do użycia jest potrzebne środowisko [node.js](https://nodejs.org)

Pseudoporadnik znajduje sie na YouTube pod tym [linkiem](https://youtu.be/j0dfhExnqAw)

Po skonfigurowaniu bota w `config.yaml` wystarczy odpalić plik `Start.bat` i powinno wszystko działać

Bot automatycznie łączy się ponownie z serwerem [gc2.pl](https://gc2.pl) przy wyrzuceniu bądź restarcie.

W projekcie są używane paczuszki:
- chalk
- discord-webhook-node
- discord.js
- js-yaml
- mineflayer
- nodemon
- prismarine-item

W razie ewentualnych błędów bądź uwag można się ze mną skontaktować na Discordzie: **nik1002#0001**

**Bota używasz na własną odpowiedzialność!**

![Screenshot](https://i.imgur.com/cif38DC.gif)
# Plik `config.yaml`
```yaml
######################################
#                                    #
#            Konfig bota             #
#                                    #
######################################

# Nick użytkownika, minimalnie 3 znaki, a maksymalnie 16 znaków,
# może składać się tylko z dużych i małych liter a-Z,
# cyfr oraz podłogi ( _ )
username: 'Fajny_Nick123'

# Hasło do konta
password: 'SuperTajneHaslo'

# Czterocyfrowy pin do konta, jeśli nie jest przypisany zostawić puste
pin: ''

# Tryb na który ma wbić bot - należy podać skrót trybu

# Dostępne tryby:
# SkyBlock 1 - sb1
# SkyBlock 2 - sb2
# SkyBlock 3 - sb3
# SkyBlock 4 - sb4
# MineBlock 1 - mb1
# MineBlock 2 - mb2
# SeaBlock - sea
# LavaBlock - lb
# PvP - pvp
# Creative - cr
tryb: 'mb1'

# Połączenie bota z Discordem
# Umożliwia otrzymywanie przez webhooka wiadomości z czatu
# oraz wysyłanie komend/wiadomości do mc przez ustawiony kanał
discordConnection:

  # Czy opcja ma być włączona
  # true - tak
  # false - nie
  enable: false

  # Token dostępu do Discordowego bota
  botToken: ''

  # Adres URL webhooka na Discordzie, na który będą wysyłane wiadomości z czatu
  webhookURL: ''
  
  # Nazwa webhooka
  webhookName: ''

  # Adres URL do ikony webhooka
  webhookIconURL: ''
  
  # ID właściciela bota, który będzie mógł pisać na czacie w mc przez Discorda
  ownerID: ''

  # ID kanału z którego bot będzie brał wiadomości właściciela bota do wysłania
  channelID: ''

  # ID servera na Discordzie na którym znajduje się wyżej opisany kanał 
  serverID: ''

# Komendy które mają się wykonać po wejściu bota na tryb
# Jeśli chcesz aby bot wbił na wyspę/grotę warto ustawić na niej wpierw /home
# i do niego się tepać, ponieważ /is ma skłonności do nie działania po wbiciu na tryb :p
commands:
  - '/is'
  - '/afk'

# Automatyczne wejście do wagonika po wykonaniu komend
# true - włączone
# false - wyłączone
autoMount: false

# Anty kick jeśli nie jest się w posiadaniu /afk, do użycia na własną odpowiedzialność
# Do działania wymagane jest trzymanie w ostatnim slocie paska narzędzi (9),
# jakiegoś bloczka, bądź nic nie robiącegu itemku jak np. patyk, węgiel, redstone itd.
# A przy ewentualnym wyrzuceniu z serwera bot od razu połączy się z powrotem
# true - włączone
# false - wyłączone
antyKick: false
```