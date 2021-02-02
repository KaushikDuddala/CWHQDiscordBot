const exports = module.exports;

// By Martin M.

module.exports.message = (client, message) => {
	// Anti-tableflip

	if(message.content.endsWith('(╯°□°）╯︵ ┻━┻') && !message.author.bot) {
		setTimeout(() => {
			message.channel.send('┬─┬ ╯( ゜-゜╯)').then(m => {
				setTimeout(() => {
					m.edit('┬─┬ ノ( ゜-゜ノ)').then(l => {
						setTimeout(() => {
							l.edit('┬─┬ ノ( ^ ˽ ^ ノ)');
						}, 500); // Stage 3
					});
				}, 700); // Stage 2
			});
		}, 200); // Stage 1
	}


	// Anti-unflip

	if(message.content.endsWith('┬─┬ ノ( ゜-゜ノ)') && !message.author.bot) {
		const msgs = message.channel.messages.fetch({ limit: 2 });

		message.channel.send('(ட °˽°)ட  ︵ ┻━┻').then(m => {
			setTimeout(() => {
				m.edit('(╯°□°）╯︵ ┻━┻').then(n => {
					if(msgs.last().content.includes(':rock:')){
						msgs.last().delete();
					}
				})
			}, 400); // Stage 2
		}); // Stage 1
	}
};