const axios = require('axios');
const Discord = require('discord.js');
const fs = require('fs');
const express = require('express');
const https = require('https');
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const bufferEq = require('buffer-equal-constant-time');
require('dotenv').config();
const client = new Discord.Client();

const app = express();

port = process.env.PORT;

let server;

if (process.env.HTTPS_CERT && process.env.HTTPS_KEY) {
	const hskey = fs.readFileSync(process.env.HTTPS_KEY);
	const hscert = fs.readFileSync(process.env.HTTPS_CERT);
	const expressOptions = {
		key: hskey,
		cert: hscert
	};

	server = https.createServer(expressOptions, app);
} else {
	server = app;
}

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(express.json());

app.get('/', (req, res) => res.send('How have you found this O_O'));
app.post('/authuser', async (req, res) => {
	data = req.body;
	console.log(data);
	if (!data.id) {
		res.status(406).send('No user id specified');
		return;
	}

	if (!req.headers.timestamp) {
		res.status(406).send('No timestamp provided');
		return;
	} else if (new Date(new Date()).getTime() - new Date(req.headers.timestamp).getTime() > 60000) {
		res.status(406).send('Invalid timestamp provided');
		return;
	}

	if (
		bufferEq(
			new Buffer(req.headers.authorization),
			new Buffer(
				CryptoJS.HmacSHA512(data.id + req.headers.timestamp, process.env.APPLICATION_SECRET).toString(
					CryptoJS.enc.Base64
				)
			)
		)
	) {
		res.status(406).send('Authorization failed');
		return;
	}

	console.log('Verifying user with code ' + data.id);
	try {
		// data = {
		// 	client_id: process.env.APPLICATION_ID,
		// 	client_secret: process.env.APPLICATION_SECRET,
		// 	grant_type: 'authorization_code',
		// 	code: data.code,
		// 	redirect_uri: 'https://elies.codewizardshq.com/Testing_Folder/discord/redirect.html',
		// 	scope: 'identify'
		// };
		// headers = {
		// 	'Content-Type': 'application/x-www-form-urlencoded'
		// };

		// var form_data = new URLSearchParams();

		// for (var key in data) {
		// 	form_data.append(key, data[key]);
		// }
		// const tokenResponse = await fetch('https://discordapp.com/api/oauth2/token', {
		// 	method: 'POST',
		// 	body: form_data,
		// 	headers: headers
		// });
		// console.log(tokenResponse);

		// if (!tokenResponse.ok) {
		// 	res.status(406).send('Code invalid/expired');
		// }
		// const tokenInfo = await tokenResponse.json();

		// if (!tokenInfo.access_token) {
		// 	res.status(407).send('An error occured.');
		// 	return;
		// }
		// const userResponse = await fetch('https://discordapp.com/api/users/@me', {
		// 	headers: { Authorization: 'Bearer ' + tokenInfo.access_token }
		// });
		// const userData = await userResponse.json();
		// res.send(userData);
		const user = client.guilds.cache.get(guildId).members.cache.get(body.id);
		// console.log(user);
		if (!user) {
			res.status(407).send('User does not exist on the CWHQ Server.');
			return;
		}

		user.send(createEmbeds(user.user.username).checking).then(function(message) {
			let role = client.guilds.cache.get(guildId).roles.cache.find((role) => role.name === giveRoleName);
			client.guilds.cache.get(guildId).members.cache.get(user.id).roles.add(role).catch(console.error);

			let role2 = client.guilds.cache.get(guildId).roles.cache.find((role) => role.name === removeRoleName);
			client.guilds.cache.get(guildId).members.cache.get(user.id).roles.remove(role2).catch(console.error);
			message.edit(createEmbeds(user.user.username).verified);
			client.guilds.cache
				.get(guildId)
				.channels.cache.find((val) => val.name === 'verify-log')
				.send(createEmbeds(user.user.username).isverified);
		});
	} catch (error) {
		console.log(error);
		res.status(407).send('An error occured.');
		return;
	}
});
server.listen(port, () => console.log(`Discord Bot listening on port ${port}!`));
// get addons -- Loader made by tbranyen

let addons = [];

const normalizedPath = require('path').join(__dirname, 'addons');

require('fs').readdirSync(normalizedPath).forEach(function(file) {
	if (file.substr(-3) === '.js') addons.push(require('./addons/' + file));
});

const guildId = process.env.GUILD_ID;
const giveRoleName = process.env.GIVE_ROLE_NAME;
const removeRoleName = process.env.REMOVE_ROLE_NAME;

addons.forEach((addon) => {
	if (addon.init) addon.init(client);
});

client.on('ready', () => {
	console.log('Logged in as ' + client.user.tag + '!');
	client.user.setActivity('uses of !verify', {
		type: 'WATCHING'
	});
	addons.forEach((addon) => {
		if (addon.ready) addon.ready();
	});
});

function createEmbeds(name, _id) {
	if (!_id) _id = null;
	return {
		checking: {
			embed: {
				title: '@' + name + ', Checking website...',
				description: '',
				url: undefined,
				color: 16777011,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png'
				},
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		toverify: {
			embed: {
				title: '@' + name + ", Check DM's for more info.",
				description: 'Instructions will be posted there.',
				url: undefined,
				color: 16777011,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png'
				},
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		sendfailed: {
			embed: {
				title: '@' + name + ', Error, cannot send DM.',
				description: "Please allow DM's from users in your security settings!",
				url: undefined,
				color: 16724736,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png'
				},
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		isverifying: {
			embed: {
				title: '@' + name + ' started the verification process.',
				url: undefined,
				color: 16777011,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		toverifydm: {
			embed: {
				title: '@' + name + ', Please read the instructions below.',
				description:
					'To verify that you have a CodeWizardsHQ Account, \n\n1) go to one of your webpages on your **CodeWizards** editor and paste ```<id verificationnum="cw' +
					_id +
					'"/>``` somewhere on the page \n\n2) Afterwards, paste in the website link below in a DM replying to me.',
				url: undefined,
				color: 16777011,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png'
				},
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		verified: {
			embed: {
				title: '@' + name + ', you are now Verified.',
				description: 'You now have your roles! Now get going and go do coding. \n\n\nShoo!\n',
				url: undefined,
				color: 63744,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png'
				},
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		isverified: {
			embed: {
				title: '@' + name + ' was verified.',
				url: undefined,
				color: 63744,
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		},
		declined: {
			embed: {
				title: '@' + name + ', you are still NOT verified!',
				description:
					'An issue has occured. Please revisit the instructions and try again. You may have mistyped or something like that. Also, the page **HAS TO BE ON CODEWIZARDS**.',
				url: undefined,
				color: '16724736',
				author: {
					name: 'Code Wizard',
					icon_url:
						'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png',
					url: undefined
				},
				timestamp: undefined,
				fields: [],
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/623314619154300988/539bf23444c28b765923eb5b40e9f859.png'
				},
				image: undefined,
				footer: {
					text: 'Code Wizard Verification Bot made by Razboy20',
					icon_url: undefined
				},
				file: undefined
			}
		}
	};
}
client.on('message', (msg) => {
	if (msg.author.id === client.user.id) return;
	try {
		addons.forEach((addon) => {
			if (addon.message) addon.message(client, msg);
		});
	} catch (err) {
		console.log(err);
	}

	if (msg.channel.type === 'text') {
		if (msg.channel.name !== process.env.VERIFY_CHANNEL_NAME) {
			return;
		}

		if (msg.content === '!verify') {
			msg.channel.send(createEmbeds(msg.member.displayName).toverify).then(function(message) {
				// send dm
				msg.author.send(createEmbeds(msg.author.username, msg.author.id).toverifydm).catch(() => {
					// if fails, edit message to be 'sendFailed'
					message.edit(createEmbeds(msg.member.displayName).sendfailed);
				});
				message.delete({ timeout: 10000 });
			});
			msg.guild.channels.cache
				.find((val) => val.name === 'verify-log')
				.send(createEmbeds(msg.member.displayName).isverifying);
		}
		if (msg.content === '!clear50') {
			msg.channel.bulkDelete(50).catch(console.error);
		}
		// if (msg.author.id == '250809865767878657') {
		// 	return;
		// }
		if (msg.author.id !== client.user.id) msg.delete({ timeout: 3000 });
	}

	//checking if author is a bot
	if (msg.author.bot === true) {
		return;
	}

	if (msg.channel.type === 'dm') {
		msg.channel.send(createEmbeds(msg.author.username).checking).then(function(message) {
			if (!msg.content.includes('codewizardshq.com')) {
				message.edit(createEmbeds(msg.author.username).declined);
			} else {
				axios
					.get(msg.content)
					.catch(function(error) {
						message.edit(createEmbeds(msg.author.username).declined);
						console.error('Website does not exist.', error);
					})
					.then(function(response) {
						console.log(response);
						if (response.data.includes('cw' + msg.author.id)) {
							let role = client.guilds.cache
								.get(guildId)
								.roles.cache.find((role) => role.name === giveRoleName);
							client.guilds.cache
								.get(guildId)
								.members.cache.get(msg.author.id)
								.roles.add(role)
								.catch(console.error);

							let role2 = client.guilds.cache
								.get(guildId)
								.roles.cache.find((role) => role.name === removeRoleName);
							client.guilds.cache
								.get(guildId)
								.members.cache.get(msg.author.id)
								.roles.remove(role2)
								.catch(console.error);
							message.edit(createEmbeds(msg.author.username).verified);
							client.guilds.cache
								.get(guildId)
								.channels.cache.find((val) => val.name === 'verify-log')
								.send(createEmbeds(msg.author.username).isverified);
						} else {
							message.edit(createEmbeds(msg.author.username).declined);
						}
					});
			}
		});
		// msg.delete();
	}
});

client.on('guildMemberAdd', (member) => {
	member.send(
		'Welcome to the **Official CodeWizardsHQ** Discord! To get started, to go the #hall-of-upgrades channel and type in `!verify`.'
	);
});

client.on('messageUpdate', (oldmsg, newmsg) => {
	if (oldmsg.author.id === client.user.id) return;
	try {
		addons.forEach((addon) => {
			if (addon.messageEdit) addon.messageEdit(client, oldmsg, newmsg);
		});
	} catch (err) {
		console.log(err);
	}
});

client.login(process.env.SECRET_TOKEN).catch(() => {
	console.error(
		'\nERROR: Incorrect login details were provided. Please change the client login token to a valid token.\n'
	);
	process.exit();
});
