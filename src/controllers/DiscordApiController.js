const { Client, GatewayIntentBits } = require('discord.js');

class DiscordApiController{
    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER'], // Se necessário
        });
    
        this.DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // Substitua pelo ID do canal que você criou
        this.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Substitua pelo seu token
        this.PERMISSIONS_INTEGER = 8; // Use o valor calculado

        this.client.once('ready', () => {
            console.log('Bot do Discord está online!');
        });
    
        this.client.login("MTMwMDgzNjk3OTg4MTI3OTYyOQ.GG6rsJ.qG_5RVFzfEv6sUuKhZTExHxAWhW5sZ5_GhVEJg");
    }
    
    async sendErrorToDiscord(errorMessage) {
       try {
            const channel = await this.client.channels.fetch(this.DISCORD_CHANNEL_ID);
            if (channel) {
                await channel.send(`🚨 Um erro ocorreu: ${errorMessage}`);
            } else {
                console.error('Canal não encontrado');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem para o Discord:', error);
        }
    }
}

module.exports = new DiscordApiController();