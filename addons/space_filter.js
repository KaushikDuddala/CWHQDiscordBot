module.exports.message = async function (client, msg) {
    const space_channel = "603336862878138408";
    if (message.channel.id != space_channel) return;
    if (message.author.bot) return;
    const split_message = message.content.split(" ");
    console.log(split_message)
    for (let i in split_message) {
        const filtered = split_message[i];
        console.log(filtered)
        if (filtered.length > 1) {
            let link = false
            let personPing = false
            let channelMention = false
            let rolePing = false
            let emoji = false
            if (filtered.toLowerCase().startsWith("https://") || filtered.toLowerCase().startsWith("http://")) {
              link = true
            }else if (filtered.match(/^<@\d+>$|^<@!\d+>$/)){
              const user_id = filtered.match(/\d+/)
              const Guild = client.guilds.cache.get("822201265379475497");
              const Members = Guild.members.cache.map(member => member.id);
              if (Members.includes(user_id[0])){
                personPing = true
              }else{
                    await message.delete();     
                    const _message = await message.reply("P l e a s e  s p a c e  y o u r  m e s s a g e s  h e r e .  T h a n k  Y o u !"); 
                    setTimeout(() => {
                        _message.delete();
                    }, 3000);   
                    break;
              }
            }else if(filtered.match(/^<#\d+>$/)){
              const channel_id = filtered.match(/\d+/)
              let channels = await client.channels.cache.keyArray()
              if (channels.includes(channel_id[0])){
                channelMention = true
              }else{
                    await message.delete();  
                    const _message = await message.reply("P l e a s e  s p a c e  y o u r  m e s s a g e s  h e r e .  T h a n k  Y o u !");  
                    setTimeout(() => {
                      _message.delete();
                    }, 3000);  
                    break;
              }
            }else if(filtered.match(/^<@&\d+>/)){
              const role_id = await filtered.match(/\d+/)
              console.log(role_id)
              const roles = await message.guild.roles.cache.keyArray();
              console.log(roles)
              if(roles.includes(role_id[0])){
                rolePing = true
              }else{
                    await message.delete();   
                    const _message = await message.reply("P l e a s e  s p a c e  y o u r  m e s s a g e s  h e r e .  T h a n k  Y o u !"); 
                    setTimeout(() => {
                        _message.delete();
                    }, 3000);    
                    break;
              }
            }else if(filtered.match(/^<:[A-Za-z._]+:\d+>$/)){
              emoji = true;
            }else if(filtered.match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g)){
              emoji = true
            }else if (!emoji && !channelMention && !rolePing && !personPing && !link){
              await message.delete();
              const _message = await message.reply("P l e a s e  s p a c e  y o u r  m e s s a g e s  h e r e .  T h a n k  Y o u !");
                setTimeout(() => {
                    _message.delete();
                }, 3000);  
                break;
            }else{

            }
        }
    }
}
