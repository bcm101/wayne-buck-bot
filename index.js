const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require("./config.json");
const fs = require('fs');

const client = new Client({default: 100});

commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('messageReactionAdd', async (reaction_orig, user) => {
    if(reaction_orig.message.author.id === client.user.id && !user.bot){
        list = client.data.get(reaction_orig.message.guildId)
        if(!list.find(e => e.id === user.id))
            list.push({username: user.username, wbucks: client.config.default, id: user.id});
        
    }
})

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if(message.author.id === client.application?.owner?.id){
        
        let cmds = message.content.split(" ");

        if(cmds[0] === "!deploy"){
            client.data.set(message.guildId, [])
            await message.guild.commands
            .set(client.commands)
            .then(() => {
                message.reply('Deployed! React to this message to be involved in the wayne bucks ponzy scheme!')
                .then(mes => {
                    mes.react("🍆");
                })
            })
            .catch(err => {
                message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
                console.error(err);
            });
        }else if(cmds[0] === "!backup"){
            try{
                list = client.data.get(message.guildId);
                list = JSON.stringify(list);
                fs.writeFile(`./servers/${message.guildId}.json`, list, () => console.log("saved to local directory"));
            }
            catch (error){
                console.error(error);
                message.reply("could not create a new local save. Check permissions.")
            }
        }else if(cmds[0] === "!loadBackup"){
            try{
                fs.readFile(`./servers/${message.guildId}.json`, 'utf-8', (error, data) => {
                    if(error)
                        throw error;
                    list = client.data.set(message.guildId, JSON.parse(data));
                })
                console.log("loaded from local directory");
            }catch(error){
                console.error(error);
                message.reply("could not load local save.");
            }
        }
    }
});

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName.toLowerCase());

    try {
        command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        interaction.followUp({
          content: 'There was an error trying to execute that command!',
        });
      }
})

client.login(config.token);

