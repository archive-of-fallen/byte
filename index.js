const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);
  client.user.setGame(`Type ${prefix}cmds to get started.`)
});

let prefix = "b:"

client.on('message', msg => {
    if (msg.content.startsWith(prefix + 'ping')) {
        msg.channel.send("Pinging...").then(sent => {
            sent.edit(`Pong! \`${sent.createdTimestamp - msg.createdTimestamp}ms\``)
        })
    }

    if (msg.content.startsWith(prefix + 'say')) {
        let args = msg.content.split(' ').slice(1).join(' ')
        if (!args) {
            msg.reply(`Please provide something for me to say.`) 
        }
        msg.channel.send(`${args}`)
    }

    if (msg.content.startsWith(prefix + 'esay')) {
        let args = msg.content.split(' ').slice(1).join(' ')
        if (!args) {
            msg.reply(`Please provide something for embed.`) 
        }
        const embed = new Discord.RichEmbed()
        .setTitle(`Message from ${msg.author.tag}`)
        .setColor(`RANDOM`)
        .setDescription(`${args}`)

        msg.channel.send({embed})
    }

    if (msg.content.startsWith(prefix + 'invite')) {
        msg.reply(`Invite me using this URL:\nhttps://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=388630510399782912.`)
    }

    if (msg.content.startsWith(prefix + 'support')) {
        msg.reply(`You can join my support server here:\nhttps://discord.gg/2AxaHpf.`)
    }

    if (msg.content.startsWith(prefix + 'eval')) {
        if (msg.author.id !== "300992784020668416") return;
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
  
    if (msg.isMentioned("388630510399782912") + " prefix") {
      msg.reply(`My prefix is: ${prefix}`);
    }

    if (msg.content.startsWith(prefix + 'cmds')) {
        const embed = new Discord.RichEmbed()
        .setTitle(`Commands`)
        .setColor(`RANDOM`)
        .setDescription(`\`${prefix}cmds\`\n\`${prefix}esay [arguments]\`\n\`${prefix}invite\`\n\`${prefix}ping\`\n\`${prefix}say [arguments]\`\n\`${prefix}support\``)

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
