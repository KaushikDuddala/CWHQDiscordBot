// Haha this will be interesting to see

module.exports.message = (client, message) => {
	if(message.content.toLowerCase().includes('your a ') || message.content.toLowerCase().includes('your an ')) {
		message.reply('*you\'re');
	}
}