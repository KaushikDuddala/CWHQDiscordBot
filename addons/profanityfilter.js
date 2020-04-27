// All code developed by @Razboy20; taken from another project of mine.

const fs = require('fs');
const fetch = require('node-fetch');

RubixFilterStatus = false;

var exports = module.exports;

exports.init = function(client) {
	client.on('presenceUpdate', function(oldPresence, newPresence) {
		try {
			if (newPresence.activities.some((val) => val.hasOwnProperty('type'))) {
				if (newPresence.activities[0].type === 'CUSTOM_STATUS') {
					console.log(
						`User ${newPresence.member.nickname
							? newPresence.member.nickname
							: newPresence.member.user.username} updated their presence to a custom status.`
					);
					const status = newPresence.activities[0].state;
					let checks = [];
					for (
						var i = 0;
						JSON.parse(fs.readFileSync('./addons/resources/profanityFilterWords.json')).phrases.length > i;
						i++
					) {
						checks.push(
							checkStatus(
								JSON.parse(fs.readFileSync('./addons/resources/profanityFilterWords.json')).phrases[
									i
								].toUpperCase(),
								status,
								newPresence.member
							)
						);
					}

					// if filter detects nothing, run
					if (!checks.some((a) => a)) {
						// check if user has prison role, if so, remove
						if (newPresence.member.roles.cache.some((role) => role.name === 'Prison')) {
							newPresence.member.roles.remove(
								newPresence.member.guild.roles.cache.find((role) => role.name === 'Prison')
							);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	});
	console.log('FILTER INIT');
};

exports.ready = function() {
	console.log('FILTER READY');
};

String.prototype.containsAny = function(array) {
	for (let i in array) {
		if (this.includes(array[i])) return true;
	}
	return false;
};

blockList = [
	'anime',
	'neko',
	'http://tenor.com/view/thumbs-up-ok-good-great-approve-gif-4434924',
	'drake',
	'pokemon',
	'japan',
	'yugioh',
	'nani',
	'jojo',
	'unknown',
	'arduinko'
];

exports.message = async function(client, msg) {
	if (msg.author.bot) return;
	if (msg.channel.name === 'admin-log') return;
	if (process.env.PERSPECTIVE_API_KEY) {
		fetch(
			`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.PERSPECTIVE_API_KEY}`,
			{
				headers: {
					'content-type': 'application/json;charset=UTF-8'
				},
				body: JSON.stringify({
					comment: {
						text: msg.content
					},
					requestedAttributes: {
						PROFANITY: {}
					},
					languages: [ 'en' ]
				}),
				method: 'POST'
			}
		)
			.then((result) => {
				const probability = JSON.parse(result).attributeScores.PROFANITY.summaryScores.value;
				console.log('Profanity probability: ' + probability);
				if (probability > 0.7) {
					msg
						.reply(
							'Please do not use profanity! Probability: ' +
								Math.round(probability * 1000) / 10 +
								'%. Thank you! `@bot`'
						)
						.then((message) => message.delete({ timeout: 6000 }));
					msg.guild.channels.cache
						.find((chan) => chan.name === 'admin-log')
						.send(
							`Message: \`${msg.content}\` - \`${Math.round(probability * 1000) /
								10}%\` has been said in ${msg.channel} by ${msg.author}.`
						);
				}
			})
			.catch((err) => console.log(err));
	} else {
		const phrases = JSON.parse(fs.readFileSync('./addons/resources/profanityFilterWords.json')).phrases;
		for (var i = 0; phrases.length > i; i++) {
			removeSaying(phrases[i].toUpperCase(), msg);
		}
	}

	if (
		RubixFilterStatus &&
		(((msg.content.includes('https://') || msg.content.includes('http://')) &&
			msg.content.containsAny(blockList)) ||
			(msg.attachments.some((val) => val.filename.containsAny(blockList)) &&
				msg.author.id === '603222450414551061'))
	) {
		msg.delete();
		msg.reply('no more anime. Pls.').then((message) => message.delete(3000));
	}
};

exports.messageEdit = function(client, oldmsg, newmsg) {
	exports.message(client, newmsg);
	console.log('MESSAGE EDITED: ' + newmsg.content);
};

const removeSaying = function(saying, msg) {
	if (msg.content.toUpperCase().includes(saying)) {
		msg.delete().catch(() => {
			console.log('--ERROR in erasing filtered text in guild: ' + msg.guild.name);
		});

		msg
			.reply('Please do not say that word! Thank you! `@bot`')
			.then((message) => message.delete({ timeout: 6000 }));

		msg.guild.channels.cache
			.find((chan) => chan.name === 'admin-log')
			.send(`Message: \`${saying}\` - \`${msg.content}\` has been said in ${msg.channel} by ${msg.author}.`);

		console.log(
			'Message: "' +
				saying +
				'"-"' +
				msg.content +
				'" has been said in ' +
				msg.guild.name +
				' - #' +
				msg.channel.name +
				' by ' +
				msg.author.username
		);
	}
};

const checkStatus = function(saying, status, member) {
	if (status.toUpperCase().includes(saying)) {
		if (member.roles.cache.some((role) => role.name === 'Prison')) return true;
		member.roles.add(member.guild.roles.cache.find((role) => role.name === 'Prison'));

		member.guild.channels.cache
			.find((chan) => chan.name === 'admin-log')
			.send(`Status: \`${saying}\` - \`${status}\` has been detected in the custom status of ${member}.`);

		console.log(
			`Status: \`${saying}\` - \`${status}\` has been detected in the custom status of ${member.nickname}.`
		);
		return true;
	}
	return false;
};
