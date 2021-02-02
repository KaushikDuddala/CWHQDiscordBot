var exports = module.exports;

// By Martin M.

exports.message = async (client, message) => {
	// Anti-tableflip

	if (message.author.bot) return;

	if (message.content.endsWith("(╯°□°）╯︵ ┻━┻")) {
		setTimeout(async () => {
			const m = await message.channel.send("┬─┬ ╯( ゜-゜╯)");
			setTimeout(async () => {
				const l = await m.edit("┬─┬ ノ( ゜-゜ノ)");
				setTimeout(() => {
					l.edit("┬─┬ ノ( ^ ˽ ^ ノ)");
				}, 500); // Stage 3
			}, 700); // Stage 2
		}, 200); // Stage 1
	}

	// Anti-unflip

	if (message.content.endsWith("┬─┬ ノ( ゜-゜ノ)")) {
		const msgs = await message.channel.messages.fetch({ limit: 2 });

		const m = await message.channel.send("(ட °˽°)ட  ︵ ┻━┻");

		setTimeout(async () => {
			await m.edit("(╯°□°）╯︵ ┻━┻");
			if (msgs.last().content.includes(":rock:")) {
				msgs.last().delete();
			}
		}, 400); // Stage 2
		// Stage 1
	}
};
