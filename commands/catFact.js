const fetch = require('node-fetch');

module.exports = {
    name: 'catfact',
    description: 'fun cool fact about cats',
    execute(interaction){

        fetch("https://catfact.ninja/fact")
        .then(res => res.json())
        .then(data => {

            return void interaction.reply({
                content: data.fact,
                ephemeral: false
            })
        })
    }
}