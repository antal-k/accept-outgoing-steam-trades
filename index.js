const SteamCommunity = require('steamcommunity');
const SteamTotp = require('steam-totp');
const steam = new SteamCommunity();

require('dotenv').config();

const logOnOptions = {
    "accountName": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "twoFactorCode": SteamTotp.getAuthCode(process.env.SHARED_SECRET),
};

steam.login(logOnOptions, function (err) {
    if (err) {
        return reject(err);
    }
    setInterval(() => {
        const time = SteamTotp.time();
        const confKey = SteamTotp.getConfirmationKey(process.env.IDENTITY_SECRET, time, 'conf');
        const allowKey = SteamTotp.getConfirmationKey(process.env.IDENTITY_SECRET, time, 'allow');
        steam.acceptAllConfirmations(
            time,
            confKey,
            allowKey,
            function (err) {
                console.log(err);
            });
    }, 30000);
});
