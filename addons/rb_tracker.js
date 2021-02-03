const schedule = require("node-schedule");
const rule = (new schedule.RecurrenceRule().hour = 0);

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const fs = require("fs");
if (!fs.existsSync("db")) {
    fs.mkdirSync("db");
}

const adapter = new FileSync("./db/rollbacks.json");
const trackers = low(adapter);

trackers.defaults({}).write();

// const trackers = new Map();

schedule.scheduleJob(rule, () => {
    adapter.write({});
});

class Tracker {
    constructor(userid) {
        this.id = userid;
        this.rollbacks = 0;
    }
}

function trackerHelper(player, value) {
    const tracker = trackers.get(player).value() ? trackers.get(player).value() : trackers.set(player, new Tracker(player)).get(player).write();

    tracker.rollbacks += value;
    if (tracker.rollbacks <= 0) {
        trackers.set(player, undefined).write();
        return 0;
    }

    trackers.update(player, tracker).write();
    return tracker.rollbacks;
}

function addRollback(args) {
    return "";
}
function removeRollback(args) {
    return "";
}
function clearRollbacks(args) {
    return "";
}
async function getPlayerRollbacks(message, player, handleEvents = true) {
    if (!player) return "Invalid syntax. Check `!rb help` for information.";

    let result;

    if (trackers.get(player).value()) {
        const tracker = trackers.get(player).value();
        result = `Player \`${player}\` has had **${tracker.rollbacks}** rollback${tracker.rollbacks > 1 ? "(s)" : ""} in the last 24 hours.`;
    } else {
        result = `Player \`${player}\` has had no rollbacks in the last 24 hours.`;
    }

    if (handleEvents) {
        const msg = await message.channel.send(result);
        await msg.react("⬇️");
        await msg.react("⬆️");

        const collector = msg.createReactionCollector(
            (r, u) => (r.emoji.name == "⬇️" || r.emoji.name == "⬆️") && !u.bot && msg.member.roles.cache.some(r => r.id == "765034419509526549")
        );
        collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name == "⬇️") {
                trackerHelper(player, -1);
            } else {
                trackerHelper(player, 1);
            }
            reaction.users.remove(user);
            msg.edit(await getPlayerRollbacks(message, player, false));
        });
    }

    return result;
}

module.exports.message = async (client, msg) => {
    if (msg.author.bot) return;
    if (!msg.member.roles.cache.some(r => r.id == "765034419509526549")) return;

    let args = msg.content.toLowerCase().split(" ");
    if (args[0] == "!rb") {
        args.shift();

        if (args.length > 0 && args[0] != "help") {
            const cmd = args[0];

            switch (cmd) {
                case "add":
                    args.shift();
                    msg.channel.send(addRollback(args));
                    break;

                case "remove":
                    args.shift();
                    msg.channel.send(removeRollback(args));
                    break;

                case "clear":
                    args.shift();
                    msg.channel.send(clearRollbacks(args));
                    break;

                default:
                    getPlayerRollbacks(msg, args[0]);
                    break;
            }
        } else {
            msg.channel.send({
                embed: {
                    title: "Rollback Command Help",
                    description:
                        "Rollbacks reset every day at midnight.\n\nKeep in mind that players are **NOT** discord users, and as such do not use a mention to add a rollback.\n\n__**Commands:**__",
                    color: 10831812,
                    fields: [
                        {
                            name: "!rb <player>",
                            value: "Retrieves the number of rollbacks that a specified player currently has."
                        },
                        {
                            name: "~~!rb add <player> [amount]~~",
                            value: "Adds a specified amount of rollbacks to a player."
                        },
                        {
                            name: "~~!rb remove <player> [amount]~~",
                            value: "Subtracts a specified amount of rollbacks to a player. (Will cap at 0 rollbacks)"
                        },
                        {
                            name: "~~!rb clear <player>~~",
                            value: "Removes a player from the database, and as such setting their rollback count to 0."
                        },
                        {
                            name: "!rb",
                            value: "Shows this help menu."
                        }
                    ]
                }
            });
        }

        return;
    }
};

// exports.message = (client, msg) => {
//     const user = msg.mentions.members.first();

//     if (user) {
//         if (trackers.has(user.id)) {
//             tracker = trackers.get(user.id);
//         } else {
//             tracker = new Tracker(user.id);
//             trackers.set(user.id, tracker);
//         }
//     } else {
//         msg.channel.send("Invalid user.");
//         return;
//     }

//     var args = msg.content.toLowerCase().split(" ");
//     if(args[0] == "!rb") {
//         if(args[1] == "add") {
//             if(msg.member.roles.cache.find(r => r.id == '765034419509526549')) {
//                 var user = msg.mentions.members.first();
//                 if(user) {
//                     const tracker = trackers.get(user.id);
//                     tracker.rollbacks++;
//                     msg.channel.send("Added a rollback to `" + user.user.tag + "`'s count.");
//                 } else {
//                     msg.channel.send("Invalid user.");
//                 }
//             } else {
//                 msg.channel.send("You do not have permission to use this command.");
//             }
//         } else if (args[1] == "remove") {
//             if(msg.member.roles.cache.find(r => r.id == '765034419509526549')) {
//                 var user = msg.mentions.members.first();
//                 if(user) {
//                     const tracker = trackers.get(user.id);
//                     if(!trackers.has(user.id)) {
//                         msg.channel.send("`" + user.user.tag + "` has had no rollbacks in the past 24 hours.");
//                     } else {
//                         if(tracker.rollbacks > 0) {
//                             tracker.rollbacks--;
//                             msg.channel.send("Removed a rollback to `" + user.user.tag + "`'s count.");
//                         } else {
//                             tracker.rollbacks = 0;
//                             msg.channel.send("Failed to remove rollback. User's count is already 0.");
//                         }
//                     }
//                 } else {
//                     msg.channel.send("Invalid user.");
//                 }
//             } else {
//                 msg.channel.send("You do not have permission to use this command.");
//             }
//         } else {
//             var user = msg.mentions.members.first() || msg.member;
//             if(user) {
//                 const tracker = trackers.get(user.id);
//                 if(trackers.has(user.id)) {
//                     msg.channel.send("`" + user.user.tag + "` has had " + tracker.rollbacks + " rollback(s) in the last 24 hours.");
//                 } else {
//                     msg.channel.send("`" + user.user.tag + "` has had no rollbacks in the past 24 hours.");
//                 }

//             } else {
//                 msg.channel.send("Invalid user.");
//             }
//         }
//     }
// }

// var exports = module.exports;
