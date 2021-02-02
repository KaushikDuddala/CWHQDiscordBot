var trackers = [];

const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule().hour = 0;

const trackers = new Map();
      
const clearRollbacks = schedule.scheduleJob(rule, () => {
    trackers.clear();
});

class Tracker {
    constructor(userid) {
        this.id = userid
        this.rollbacks = 0;
    }
}

exports.message = (client, msg) => {
    const user = msg.mentions.members.first();
    
    if (user) {
        if (trackers.has(user.id)) {
            tracker = trackers.get(user.id);
        } else {
            tracker = new Tracker(user.id);
            trackers.set(user.id, tracker);
        }
    } else {
        msg.channel.send("Invalid user.");
        return;
    }
    
    var args = msg.content.toLowerCase().split(" ");
    if(args[0] == "!rb") {
        if(args[1] == "add") {
            if(msg.member.roles.cache.find(r => r.id == '765034419509526549')) {
                var user = msg.mentions.members.first();
                if(user) {
                    const tracker = trackers.get(user.id);
                    tracker.rollbacks++;
                    msg.channel.send("Added a rollback to `" + user.user.tag + "`'s count.");
                } else {
                    msg.channel.send("Invalid user.");
                }
            } else {
                msg.channel.send("You do not have permission to use this command.");
            }
        } else if (args[1] == "remove") {
            if(msg.member.roles.cache.find(r => r.id == '765034419509526549')) {
                var user = msg.mentions.members.first();
                if(user) {
                    const tracker = trackers.get(user.id);
                    if(!trackers.has(user.id)) {
                        msg.channel.send("`" + user.user.tag + "` has had no rollbacks in the past 24 hours.");
                    } else {
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
            var user = msg.mentions.members.first() || msg.member;
            if(user) {
                const tracker = trackers.get(user.id);
                if(trackers.has(user.id)) {
                    msg.channel.send("`" + user.user.tag + "` has had " + tracker.rollbacks + " rollback(s) in the last 24 hours.");
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
