var exports = module.exports;

exports.message = function(client, msg) {
    //Checking if message is to open a report
	if (msg.content === '!report') {
        const user = message.author.id; //assigning user var for easier access
	let userName = client.users.cache.get(user); //making the name the users name instead of their ID
        const name = "ticket-" + userName.username; //making a name for the new channel
        if(message.guild.channels.cache.find(ch => ch.name == name)){
            message.channel.send("You have already opened a ticket") //making sure they dont have a ticket already open for anti-spam
        }else{
    message.guild.channels.create(name).then((chan)=>{
    chan.updateOverwrite(message.guild.roles.everyone, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false
    }) //setting everyone permissions as false
    chan.updateOverwrite(user,{
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true
    }) //setting send permissions for person who opened the ticket
    chan.updateOverwrite("839199970077704262",{
        SEND_MESSAGES:true,
        VIEW_CHANNEL:true
    })
    msg.delete() //deleting where they said !report so others dont know for privacy and stuff 
    chan.send("Moderators will be here shortly, In the meantime explain your report and wait until they respond, after they respond a moderator may do !close and close this ticket.").then((m)=>{
        m.pin() //making a info message and pinning it
    })
    })   

     }
    //checking if message is to close the ticket
    }else if(msg.content = '!close'){
        const user = client.users.cache.get(message.author.id);
 	if(!message.member.roles.cache.has("848736231197638667")) return message.channel.send("Only a moderator can end a ticket!") //making it so only mods can do it
        if(message.member.roles.cache.has("848736231197638667")) return message.channel.delete() //deleting the channel, probably going to make it so that it only works only channels starting with "ticket" in case a mod accidently does it in general or something
    }
    }
};
