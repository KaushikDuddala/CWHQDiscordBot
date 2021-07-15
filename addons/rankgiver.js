module.exports.message = (client, message) => {
	if(message.author.id != require("./resources/config.json").mee6_id || !message.content.startsWith("Congrats")) return;

	const user = message.mentions.members.first();
	const level = parseInt(message.content.substring(message.content.indexOf("level")).slice(6).match(/\d+/)[0]);
	const rank = require("./resources/config.json").ranks.filter(rank => rank.level <= level).pop();

	if(rank && level && user) {
		if(user.roles.cache.find(role => role.name == rank.name)) return;
		user.roles.add(user.guild.roles.cache.find(role => role.name == rank.name));
	}
}