var exports = module.exports;

prefix = '-';

adminRoles = require("./resources/config.json").roles.admin;

exports.message = function(client, msg) {
	if (msg.channel.type !== 'text') return;

	const command = msg.content.split(' ')[0].slice(prefix.length);

	if (msg.member.roles.cache.some((val) => val.name.containsAny(adminRoles))) {
		if (command === 'createInvite') {
			msg.channel.startTyping();
			msg.channel
				.createInvite({ maxAge: 0, unique: true })
				.then(function(invite) {
					msg.channel.stopTyping(true);
					console.log(`Created an invite with a code of ${invite.code}`);
					msg.channel.send(`Invite created!\n${invite.url}`);
				})
				.catch(console.error);
		} else if (command === 'checkStatus') {
			try {
				const activity = msg.author.presence.activities[0];
				console.log(activity);
				if (activity.type === 'CUSTOM_STATUS') {
					msg.reply(`Custom status: ${activity.state}`);
				}
				msg.react('✅');
			} catch (error) {
				console.error(error);
				msg.react('❌');
			}
		}
	}
};
