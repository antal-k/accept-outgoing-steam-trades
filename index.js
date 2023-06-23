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
          //   console.log(confirmation);
          // Depends on type of confirmation: if offer then it's offerID-based, but market is not. Market listing id seems to be the property "creator";

          console.log(confirmation.title);

          if (confirmation.offerID) {
            // market confirmation wouldn't have receiving/ sending;
            console.log(
              `Trade offer summary for ${confirmation.offerID}: ${confirmation.sending}, ${confirmation.receiving}`
            );
          }

          steam.acceptConfirmationForObject(
            process.env.SDA_IDENTITY_SECRET,
            confirmation.creator,
            function (err) {
              console.log(`Accepted confirmation ${confirmation.creator}`);
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
