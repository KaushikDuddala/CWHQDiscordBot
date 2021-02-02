const exports = module.exports;

// By Martin M.

module.exports.message = (client, message) => {
	// Anti-tableflip

	if(message.endsWith('(╯°□°）╯︵ ┻━┻') && !message.author.bot) {
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

	if(message.endsWith('┬─┬ ノ( ゜-゜ノ)') && !message.author.bot) {
		message.channel.send('(ட °˽°)ட  ︵ ┻━┻').then(m => {
			setTimeout(() => {
				m.edit('(╯°□°）╯︵ ┻━┻');
			}, 400); // Stage 2
		}); // Stage 1
	}
};