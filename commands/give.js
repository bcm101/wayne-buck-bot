module.exports = {
    name: 'give',
    description: 'give wayne bucks to another player',
    options: [
        {
          name: 'user',
          type: 6,
          description: 'the user to give them there wayne bucks to',
          required: true,
        },
        {
            name: 'amount',
            type: 4,
            description: 'amount of wayne bucks',
            required: true,
          },
      ],
    execute(interaction, client){
        try{
            options = interaction.options._hoistedOptions;
            target = options.find(e => e.name === "user")?.user;
            amount = options.find(e => e.name === "amount")?.value

            if(amount <= 0 ) throw 'negative or 0 amount';

            data = client.data.get(interaction.guildId);
            targetData = data.find(e => e.id === target.id)

            userData = data.find(e => e.id === interaction.user.id);

            if(userData.wbucks < amount) throw 'amount greater than user wayne bucks'

            userData.wbucks -= amount;
            targetData.wbucks += amount;

            return void interaction.reply({
                content: `${userData.username} gives ${amount} to ${targetData.username}`,
                ephemeral: false,
            })
            
        }catch(error){
            console.error(error);
            return void interaction.reply({
                content: `could not give wayne bucks to user. reason: ${error}`,
                ephemeral: true
            })
        }
        
        
        
        
        
    }
}