//Required
const Discord = require('discord.js');

// Bot Stuff
const utilityFuncs = require('../../utilityFuncs.js');

// Path to 'data' folder
const dataPath = './data'

//FS, for writing files.
const fs = require('fs');

function removeLoot(message, prefix) {
    if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
        message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
        return false
    }
    
    if (!message.member.permissions.serialize().ADMINISTRATOR) {
        message.channel.send("You lack sufficient permissions, I'm so sorry!");
        return false
    }

    const arg = message.content.slice(prefix.length).trim().split(/ +/);

    if (!arg[1]) {
        const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}assignloot`)
				.setDescription("(Args <Loot Table>)\nRemoves a loot table and unsets it for everything.")
            message.channel.send({embeds: [DiscordEmbed]})
            return false
    }

    var lootPath = dataPath+'/Loot/lootTables.json'
    var lootRead = fs.readFileSync(lootPath);
    var lootFile = JSON.parse(lootRead);
    var enmPath = dataPath+'/enemies.json'
    var enmRead = fs.readFileSync(enmPath);
    var enmFile = JSON.parse(enmRead);

    if (!lootFile[arg[1]]) {
        message.channel.send(`${arg[1]} is not a loot table.`)
        return false
    }

    let enmList = ``

    for (const i in enmFile) {
        if (enmFile[i].loot == arg[1]) {
            enmFile[i].loot = ''

            enmList += `\n- ${i}`
        }
    }
    fs.writeFileSync(enmPath, JSON.stringify(enmFile, null, '    '));

    delete lootFile[arg[1]]
    fs.writeFileSync(lootPath, JSON.stringify(lootFile, null, '    '));

    message.channel.send(`**${arg[1]}** has been removed, and with it, the enemies that no longer have the loot are:${enmList}`);
}

// Export Functions
module.exports = {
	initialize: function (message, prefix) {
		return removeLoot(message, prefix)
	},
}