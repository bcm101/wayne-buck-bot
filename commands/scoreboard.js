module.exports = {
    name: 'scoreboard',
    description: 'display a scoreboard of the top wayne buck earners',
    execute(interaction, client) {
      list = client.data.get(interaction.guild.id).slice(0);
      list.sort((a,b) => b.wbucks - a.wbucks)
      let str = "";
      list.forEach((e,i) => {
          str += `${i+1}.)${e.username}: ~~w~~ ${e.wbucks}\n`;
      });

      return void interaction.reply({
        content: str,
        ephemeral: false,
      });
    },
  };