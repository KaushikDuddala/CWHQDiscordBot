var trackers = [];

const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule().hour = 0;
const clearRollbacks = schedule.scheduleJob(rule, () => {
    trackers = [];
});

function getTracker(userid) {
    return trackers.filter(obj => {
        return obj.id === userid;
    });
    return null;
}

class Tracker {
    constructor(userid) {
        this.id = userid
        this.rollbacks = 0;
    }
}
exports.message = (client, msg) => {
    var args = msg.content.toLowerCase().split(" ");
    if(args[0] == "!rb") {
        if(args[1] == "add") {
            if(msg.member.roles.cache.find(r => r.id.toString() === '765034419509526549')) {
                var user = msg.guild.member(msg.mentions.users.first());
                if(user) {
                    var tracker = getTracker(user.id);
                    if(tracker.length == 0) {
                        tracker = new Tracker(user.id)
                        trackers.push(tracker);
                    } else {
                        tracker = tracker[0]
                    }
                    tracker.rollbacks++;
                    msg.channel.send("Added a rollback to `" + user.user.tag + "`'s count.");
                } else {
                    msg.channel.send("Invalid user.");
                }
            } else {
                msg.channel.send("You do not have permission to use this command.");
            }
        } else if(args[1] == "remove") {
            if(msg.member.roles.cache.find(r => r.id.toString() === '765034419509526549')) {
                var user = msg.guild.member(msg.mentions.users.first());
                if(user) {
                    var tracker = getTracker(user.id);
                    if(tracker.length == 0) {
                        msg.channel.send("`" + user.user.tag + "` has had no rollbacks in the past 24 hours.");
                    } else {
                        tracker = tracker[0];
                        if(tracker.rollbacks > 0) {
                            tracker.rollbacks--;
                            msg.channel.send("Removed a rollback to `" + user.user.tag + "`'s count.");
                        } else {
                            tracker.rollbacks = 0;
                            msg.channel.send("Failed to remove rollback. User's count is already 0.");
                        }
                    }
                } else {
                    msg.channel.send("Invalid user.");
                }
            } else {
                msg.channel.send("You do not have permission to use this command.");
            }
        } else {
            var user = msg.guild.member(msg.mentions.users.first()) || msg.member;
            if(user) {
                var tracker = getTracker(user.id);
                if(tracker.length != 0) {
                    msg.channel.send("`" + user.user.tag + "` has had " + tracker[0].rollbacks + " rollback(s) in the last 24 hours.");
                } else {
                    msg.channel.send("`" + user.user.tag + "` has had no rollbacks in the past 24 hours.");
                }
              
            } else {
                msg.channel.send("Invalid user.");
            }
        }
    } 
}

var exports = module.exports;
