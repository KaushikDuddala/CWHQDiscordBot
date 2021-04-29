module.exports.message = function (client, msg) {
    const space_channel = "603336862878138408";
    if (msg.channel.id != space_channel) return;
    if (msg.author.bot) return;
    const split_msg = msg.content.split(" ");

    split_msg.find(async filtered => {
        if (filtered.length > 1) {
            if (
                !filtered.toLowerCase().startsWith("https://") &&
                !filtered.toLowerCase().startsWith("http://") &&
                !filtered.match(/^<[@#&]|(@&)\d+>$/)
            ) {
                await msg.delete();
                const _msg = await msg.reply("P l e a s e  s p a c e  y o u r  m e s s a g e s  h e r e .  T h a n k  Y o u !");
                setTimeout(() => {
                    _msg.delete();
                }, 3000);

                return true;
            }
        }
        return false;
    });
};
