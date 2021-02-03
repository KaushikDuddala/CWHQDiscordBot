const https = require("https");

module.exports.message = (client, message) => {
	const prefix = "!";
	const aliases = ["definition", "def", "identify", "dictionary", "meaning", "define"];

	const command = message.content.toLowerCase().split(" ")[0].slice(1);
	const args = message.content.split(" ").slice(1);

	if (!(message.content.toLowerCase().startsWith(prefix) && aliases.includes(command))) return;
	if (args.length == 0) return message.reply("Please provide a word");
	if (args.length > 1) return message.reply("Please provide only one word");

	const word = args[0].toLowerCase();

	https.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				if (JSON.parse(data).title) return message.reply(`**Could not find definition for: \`${word}\`**`);

				const result = JSON.parse(data)[0];

				let embed = {
					color: Math.floor(Math.random() * 16777215) + 1,
					title: `**Word**: ${result.word}\n**Pronunciation**: *${result.phonetics[0].text.replace("\\", "").replace("/", "")}*\n**Meanings:**`,
					fields: result.meanings.map((meaning) => {
						return {
							name: `**Part of Speech:** ${meaning.partOfSpeech}`,
							value: `**Definition:** ${meaning.definitions[0].definition}${
								meaning.definitions[0].example ? `\n**Example:** ${meaning.definitions[0].example.replace(word, `**${word}**`)}` : ""
							}${meaning.definitions[0].synonyms ? `\n**Synonyms:** ${meaning.definitions[0].synonyms.join(", ")}` : ""}`,
						};
					}),
				};

				return message.reply({ embed });
			});
		})
		.on("error", (err) => {
			console.log("Error: " + err.message);
			return message.reply("An error occured while making the request to the API");
		});

	return;
};
