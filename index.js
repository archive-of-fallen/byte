const Discord = require("discord.js");
const client = new Discord.Client();
const snekfetch = require("snekfetch");
const pirateSpeak = require("pirate-speak");

client.on('ready', () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);
  client.user.setActivity(`Type ${prefix}help`)
});

// Keeping as let for future customizable prefixes
let prefix = "b;"

const blacklistedIds = [ "229552088525438977", "356013659522072587" ] 
// All IDs in this array are user IDs. 

const blacklistedGuilds = [ "350888950078111745" ] 
// I will not reveal the blacklisted users nor guilds. They have obviously done something very wrong to deserve this blacklist.

const authorizedUsers = [ "299175087389802496", "300992784020668416", "423770070485827585" ]

client.on('guildCreate', guild => {
  if (blacklistedGuilds.includes(guild.id)) {
    guild.leave();
  } 
});

client.on('message', msg => {
    if (msg.author.bot) return;

    //If mentioned and given prefix command, reply with the current prefix
    if ( (new RegExp(`^(<|!|@)+${client.user.id}>(\\s)+prefix$`)).test(msg.content) ) {
        return msg.reply(`My prefix is: \`${prefix}\`.`);
    } 

    if (!msg.content.startsWith(prefix)) return;
    if (blacklistedIds.includes(msg.author.id)) return;
  
    if (msg.content.startsWith(prefix + 'ping')) {
        msg.channel.send("Pinging...").then(sent => {
            sent.edit(`Pong! \`${sent.createdTimestamp - msg.createdTimestamp}ms\``)
        })
    }

    if (msg.content.startsWith(prefix + 'say')) {
        const args = msg.content.split(' ').slice(1).join(' ');
        if (!args) {
            return msg.reply(`Please provide something for me to say.`);
        }
        return msg.channel.send(`${args}`);
    } 

    if (msg.content.startsWith(prefix + 'esay')) {
        const args = msg.content.split(' ').slice(1).join(' ');
        if (!msg.channel.permissionsFor(client.user).has("EMBED_LINKS")) {
            return msg.reply(`I cannot send an embed in this channel. Please make sure I have the \`EMBED_LINKS\` permission.`);
        }
        if (!args) {
            return msg.reply(`Please provide something for me to embed.`);
        }
        const embed = new Discord.RichEmbed()
        .setTitle(`Message from ${msg.author.tag}`)
        .setColor(`RANDOM`)
        .setDescription(`${args}`)

        return msg.channel.send({embed});
    } 

    if (msg.content.startsWith(prefix + 'invite')) {
        msg.reply(`Invite me using this URL:\nhttps://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=388630510399782912.`)
    }

    if (msg.content.startsWith(prefix + 'support')) {
        msg.reply(`You can join my support server here:\nhttps://discord.gg/2AxaHpf.`)
    }

    if (msg.content.startsWith(prefix + 'eval')) {
        // if (msg.author.id !== "300992784020668416") return;
        if (!authorizedUsers.includes(msg.author.id)) return;
        const code = msg.content.split(" ").slice(1).join(" ");
        try {
         let evaled = eval(code);
         if (!code) {
             return msg.channel.send("Please provide something for me to eval!");
         }
    
         if (typeof evaled !== 'string')
           evaled = require('util').inspect(evaled);
        
           const embed = new Discord.RichEmbed()
           .setTitle(`EVAL ✅`)
       
           .setColor("0x4f351")
           .setDescription(`📥 Input: \n \`\`\`${code}\`\`\` \n 📤 Output: \n  \`\`\`${clean(evaled)}\`\`\``)
       
         msg.channel.send({embed});
       } catch (err) {
         const embed = new Discord.RichEmbed()
         .setTitle(`EVAL ❌`)
    
         .setColor("0xff0202")
         .setDescription(`📥 Input: \n \`\`\`${code}\`\`\` \n 📤 Output: \n  \`\`\`${clean(err)}\`\`\``)
    
         msg.channel.send({embed});
       }
     }

    if (msg.content.startsWith(prefix + 'nick')) {
      const args = msg.content.split(' ').slice(1).join(' ');
      if (!authorizedUsers.includes(msg.author.id)) return;
      if (!msg.guild.me.permissions.has("CHANGE_NICKNAME")) {
        return msg.reply("I do not have permission to execute this command!");
      }
      if (!args) {
        return msg.reply("What do you want my name to be?");
      }
      if (args === "reset") {
        return msg.channel.send(`👌 Successfully cleared my nickname!`).then(msg.guild.member(client.user).setNickname('', `${msg.author.tag} executed the nick command.`));
      }
      return msg.channel.send(`👌 Successfully set my nickname to **${args}**!`).then(msg.guild.member(client.user).setNickname(args, `${msg.author.tag} executed the nick command.`));
    }
  
    if (msg.content.startsWith(prefix + 'help')) {
      const embed = new Discord.RichEmbed()
      .setTitle(`HELP DOCUMENTATION 📥`)
      // .addBlankField(true) - Remove blank field (for now)
      .setColor(`RANDOM`)
      .addField(`Prefix`, `${prefix}`)
      .addField(`Full Command Reference`, `Type ${prefix}cmds`)
      .addField(`Invite`, `[here](https://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=388630510399782912)`)
      .addField(`Support Server`, `[here](https://discord.gg/2AxaHpf)`)
      .addField(`Contributor List`, `Puerosola#0064`)
      .addField(`Author`, `FallenLight#5149`)
      // .setFooter(``)
      
      msg.channel.send({embed});
    }
  
    if (msg.content.startsWith(prefix + 'pirate')) {
      const toTranslate = msg.content.split(' ').slice(1).join(' ');
      
      if(!toTranslate) {
        return msg.reply("Please provide something for me to pirate-ify!");
      } 
      
      try {
            msg.channel.send(pirateSpeak.translate(toTranslate));
      } catch(err) {
            console.error(err);
      }
    }
  
    if (msg.content.startsWith(prefix + 'servers')) {
      if (!authorizedUsers.includes(msg.author.id)) return;
      
      return msg.channel.send(`${client.guilds.map(g => `${g.name} (ID - ${g.id} | Owner - ${g.owner.id}): ${g.memberCount} total members`).join('\n\n')}`);
    }
  
    if (msg.content.startsWith(prefix + 'report')) {
      const toReport = msg.content.split(' ').slice(1).join(' ');
      const reportC = client.channels.get('428107431063584768');
      if(!toReport) {
        return msg.reply('Please provide something to report!');
      }
      
      msg.channel.send('Report successfully submitted!\nPlease note: abuse of this command is punishable by blacklist for both you and your guild.')
      
      const embed = new Discord.RichEmbed()
      .setTitle(`New report from ${msg.author.tag}!`)
      .setColor(`RANDOM`)
      .addField('Server:', `${msg.guild.id}`)
      .addField('Reporter\'s ID:', `${msg.author.id}`)
      .addField('Body:', `${toReport}`)
      
      reportC.send({ embed });
    }

    if (msg.content.startsWith(prefix + 'cmds')) {
        const embed = new Discord.RichEmbed()
        .setTitle(`Commands`)
        .setColor(`RANDOM`)
        .setDescription(`\`${prefix}cmds\`\n\`${prefix}esay [arguments]\`\n\`${prefix}help\`\n\`${prefix}invite\`\n\`${prefix}ping\`\n\`${prefix}say [arguments]\`\n\`${prefix}support\`\n\`${prefix}pirate [text]\`\n\`${prefix}report [text]\``)
        // .setFooter(``)

        msg.channel.send({embed});
    }
});

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

client.login(process.env.token);        
