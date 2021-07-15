const { message } = require("./rb_tracker");

var exports = module.exports;

prefix = "-";

adminRoles = require("./resources/config.json").roles.admin;

exports.message = function (client, msg) {
    const command = msg.content.split(" ")[0].slice(prefix.length);

    if (msg.channel.type !== "text") return;

    if (msg.author.bot) return;

    if (msg.member.roles.cache.some(val => val.name.containsAny(adminRoles))) {
        if (command === "clear") {
            let num = parseInt(msg.content.slice(prefix.length + command.length + 1));
            if (num === NaN) return;

            if (msg.mentions.members.first()) {
                if (msg.author.id === msg.mentions.members.first().id) num++;
                msg.channel.messages
                    .fetch()
                    .then(fetched => {
                        console.log("Attempting to clear channel of " + num + " messages...");

                        const messages = fetched.filter(m => m.author.id === msg.mentions.members.first().id).first(num);

                        msg.channel.bulkDelete(messages, true).then(() => {
                            if (msg.author.id === msg.mentions.members.first().id) num--;
                            msg.channel.send(num + " messages cleared!").then(messageToDelete => messageToDelete.delete({ timeout: 3000 }));
                        });
                        if (msg.author.id !== msg.mentions.members.first().id) msg.delete();
                    })
                    .catch(console.error);
            } else {
                num++;
                msg.channel.messages
                    .fetch({ limit: num })
                    .then(fetched => {
                        console.log("Attempting to clear channel of " + num + " messages...");
                        const messages = fetched;

                        msg.channel.bulkDelete(messages, true).then(() => {
                            msg.channel.send(num - 1 + " messages cleared!").then(messageToDelete => messageToDelete.delete({ timeout: 3000 }));
                        });
                    })
                    .catch(console.error);
            }
        }
    }
};
