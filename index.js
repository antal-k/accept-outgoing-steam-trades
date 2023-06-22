const SteamCommunity = require("steamcommunity");
const SteamTotp = require("steam-totp");
const steam = new SteamCommunity();

require("dotenv").config();

const logOnOptions = {
	accountName: process.env.STEAM_USERNAME,
	password: process.env.STEAM_PASSWORD,
	twoFactorCode: SteamTotp.getAuthCode(process.env.SDA_SHARED_SECRET),
};

steam.login(logOnOptions, function (err) {
	if (err) {
		console.log(`Error during login: ${err.message}`);
		throw err;
	}

	console.log(`Successfully logged in as ${process.env.STEAM_USERNAME}`);
	setInterval(() => {
		const time = SteamTotp.time();
		const confKey = SteamTotp.getConfirmationKey(
			process.env.SDA_IDENTITY_SECRET,
			time,
			"conf"
		);
		const allowKey = SteamTotp.getConfirmationKey(
			process.env.SDA_IDENTITY_SECRET,
			time,
			"allow"
		);


		steam.getConfirmations(time, confKey, function (err, confirmations) {
			if (err) {
				// Tell me whhat happened
				console.log(`Error during confirmations: ${err.message}`);
			}

			if (confirmations && confirmations.length > 0) {
				console.log(`Accepting ${confirmations.length} confirmations...`);
				for (const confirmation of confirmations) {
					console.log(confirmation.title);
					console.log(confirmation.receiving);
					console.log(confirmation.sending);
					steam.acceptConfirmationForObject(
						process.env.SDA_IDENTITY_SECRET,
						confirmation.offerID,
						function (err) {
							console.log(`Accepted confirmation ${confirmation.id}`);
							if (err) {
								console.log(err);
							}
						}
					);
				}
			} else {
				console.log("No confirmations to accept.");
			}
		});
	}, process.env.POLLING_INTERVAL);
});
