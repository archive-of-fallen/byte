const Discord = require("discord.js");
const client = new Discord.Client();
const snekfetch = require("snekfetch");

client.on('ready', () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);
  client.user.setGame(`Type ${prefix}help`)
});

let prefix = "b:"

let blacklistedIds = [ "229552088525438977", "356013659522072587" ] 
// All IDs in this array are user IDs. 

let blacklistedGuilds = [ "350888950078111745" ] 
// I will not reveal the blacklisted users nor guilds. They have obviously done something very wrong to deserve this blacklist.

let authorizedUsers = [ "299175087389802496", "300992784020668416" ]

client.on('guildCreate', guild => {
  if (blacklistedGuilds.includes(guild.id)) {
    guild.leave();
  } 
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix)) return;
    if (msg.author.bot) return;
    if (blacklistedIds.includes(msg.author.id)) return;
  
    if (msg.content.startsWith(prefix + 'ping')) {
        msg.channel.send("Pinging...").then(sent => {
            sent.edit(`Pong! \`${sent.createdTimestamp - msg.createdTimestamp}ms\``)
        })
    }

    if (msg.content.startsWith(prefix + 'say')) {
        let args = msg.content.split(' ').slice(1).join(' ');
        if (!args) {
            return msg.reply(`Please provide something for me to say.`);
        }
        return msg.channel.send(`${args}`);
    } 

    if (msg.content.startsWith(prefix + 'esay')) {
        let args = msg.content.split(' ').slice(1).join(' ');
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
        let evall = msg.content.split(' ')[0];
        let evalstuff = msg.content.split(" ").slice(1).join(" ");
        try {
         const code = msg.content.split(" ").slice(1).join(" ");
         let evaled = eval(code);
         if (!code) {
             return msg.channel.send("Please provide something for me to eval!");
         }
    
         if (typeof evaled !== 'string')
           evaled = require('util').inspect(evaled);
        
           const embed = new Discord.RichEmbed()
           .setTitle(`EVAL ✅`)
       
           .setColor("0x4f351")
           .setDescription(`📥 Input: \n \`\`\`${evalstuff}\`\`\` \n 📤 Output: \n  \`\`\`${clean(evaled)}\`\`\``)
       
         msg.channel.send({embed});
       } catch (err) {
         const embed = new Discord.RichEmbed()
         .setTitle(`EVAL ❌`)
    
         .setColor("0xff0202")
         .setDescription(`📥 Input: \n \`\`\`${evalstuff}\`\`\` \n 📤 Output: \n  \`\`\`${clean(err)}\`\`\``)
    
         msg.channel.send({embed});
       }
     }
  
    /* 
    if (msg.content === "<@388630510399782912> prefix") {
      return msg.reply(`My prefix is: \`${prefix}\`.`); - Broken
    } 
    */
  
    if (msg.content.startsWith(prefix + 'nick')) {
      let args = msg.content.split(' ').slice(1).join(' ');
      if (msg.author.id !== "300992784020668416") return;
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
      .addField(`Full Command Reference`, `Type b:cmds`)
      .addField(`Invite`, `[here](https://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=388630510399782912)`)
      .addField(`Support Server`, `[here](https://discord.gg/2AxaHpf)`)
      .addField(`Contributor List`, `Puerosola#5543`)
      .addField(`Author`, `FallenLight#5149`)
      // .setFooter(``)
      
      msg.channel.send({embed});
    }

    if (msg.content.startsWith(prefix + 'cmds')) {
        const embed = new Discord.RichEmbed()
        .setTitle(`Commands`)
        .setColor(`RANDOM`)
        .setDescription(`\`${prefix}cmds\`\n\`${prefix}esay [arguments]\`\n\`${prefix}help\`\n\`${prefix}invite\`\n\`${prefix}ping\`\n\`${prefix}say [arguments]\`\n\`${prefix}support\``)
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
