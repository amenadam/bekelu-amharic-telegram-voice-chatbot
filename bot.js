const { Telegraf } = require("telegraf");
require("dotenv").config();
const googleTTS = require("google-tts-api");
const botToken = process.env.BOT_TOKEN;
const bot = new Telegraf(botToken); // Replace with your Telegram bot token

const {
  processMessage,
  setBotName,
  setCompanyName,
  setOpenHours,
  setContactAddress,
  callCenterStatus,
  website,
  delivery,
  setDeveloperName,
} = require("amharic-chatbot");

setBotName("በቀሉ");
setCompanyName("ኛ ድርጅት");
setOpenHours("2", "11", "5");
setContactAddress("09 37 14 73 73", "amenadamsolomon5@gmail.com", "ጅማ");
callCenterStatus(true);
website(true, "https://acelinks.rf.gd");
delivery(true, true);
setDeveloperName("amenadam solomon");

// Function to generate TTS and fetch audio buffer
async function generateTTS(text) {
  try {
    const url = googleTTS.getAudioUrl(text, { lang: "am", slow: false });

    // Use dynamic import to load node-fetch
    const fetch = (await import("node-fetch")).default;

    const audioBuffer = await fetch(url).then((res) => res.buffer());
    return audioBuffer;
  } catch (error) {
    console.error("TTS Error:", error);
    throw new Error("Error generating speech");
  }
}

bot.command("start", async (ctx) => {
  const response = "ሰላም በቀሉ እባላለሁ። ምን ልርዳዎ?"; // Ensure this returns a string
  console.log("Chatbot response:", response);
  const message = await ctx.reply(
    "🚧 This bot is under development. Stay tuned for updates! 🚀"
  );

  if (!response || typeof response !== "string") {
    await ctx.reply("Sorry, I couldn't process your message.");
    return;
  }

  try {
    const audioBuffer = await generateTTS(response);
    await ctx.pinChatMessage(message.message_id);
    console.log("Generating voice...");
    await ctx.replyWithVoice({ source: audioBuffer });
  } catch (error) {
    console.error("Error generating voice:", error);
    await ctx.reply("Sorry, there was an error generating the voice message.");
    console.error("Error pinning message:", error);
  }
});

// Handle incoming messages and reply with voice
bot.on("text", async (ctx) => {
  let response = processMessage(ctx.message.text); // Ensure this returns a string

  if (!response || typeof response !== "string") {
    await ctx.reply("Sorry, I couldn't process your message.");
    return;
  }
  if (ctx.message.text.includes("ባል")) {
    response = "ባሌ አበበ ይባላል። እሱን ማግኘት ከፈለጉ @Abebechatbot ይጠቀሙ";
  }
  console.log("Chatbot response:", response);

  try {
    const audioBuffer = await generateTTS(response);
    console.log("Generating voice...");
    await ctx.replyWithVoice({ source: audioBuffer }, { caption: response });
  } catch (error) {
    console.error("Error generating voice:", error);
    await ctx.reply("Sorry, there was an error generating the voice message.");
  }
});

bot.launch();
