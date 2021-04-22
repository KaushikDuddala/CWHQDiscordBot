module.exports.message = function(client, msg) {
	const space_channel = "603336862878138408";
	if(msg.channel.id != space_channel) return;
	const split_msg = msg.content.split(" ");

	split_msg.forEach(element => {
		const filtered = element.replace(" ", "");

		if(filtered.length > 1) {
			if(!filtered.toLowerCase().startsWith("https://") && !filtered.toLowerCase().startsWith("http://") && !filtered.match(/^<[@#&]|(@&)\d+>$/)) {
				return msg.delete();
			}
		}
	});
};