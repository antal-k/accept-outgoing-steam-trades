const SteamTotp = require("steam-totp");
require("dotenv").config();

// Generate and display the current TOTP code
const authCode = SteamTotp.getAuthCode(process.env.SDA_SHARED_SECRET);
const timeOffset = SteamTotp.time();

// TOTP codes change every 30 seconds
const timeRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);

console.log("\n=== Steam TOTP Code ===");
console.log(`Account: ${process.env.STEAM_USERNAME}`);
console.log(`Code: ${authCode}`);
console.log(`Time remaining: ${timeRemaining} seconds`);
console.log("========================\n");

