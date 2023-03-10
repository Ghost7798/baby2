
import fetch from "node-fetch";
import yts from "yt-search";
/**
 *
 * @param {*} query
 * @param {*} options
 * @returns
 */
async function search(query, options = {}) {
  const search = await yts.search({ query, hl: "en", gl: "EN", ...options });
  return search.videos;
}

function MilesNumber(number) {
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = "$1.";
  let arr = number.toString().split(".");
  arr[0] = arr[0].replace(exp, rep);
  return arr[1] ? arr.join(".") : arr[0];
}

function secondString(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text)
    throw `*[βππππβ] THIS COMMAND IS FOR PLAYING YOUTUBE SONGS*\n\n*ββ π΄XAMPLE:*\n*${
      usedPrefix + command
    } sefali*`;
  try {
    const yt_play = await search(args.join(" "));
    let texto1 = `*βββπ πππππππ ππππ πβββ*\n
β π *ππΈπLE:* ${yt_play[0].title}
β π *πΏππ±π»πΈπ²ED:* ${yt_play[0].ago}
β β *π³πππ°TπΈπΎπ½:* ${secondString(yt_play[0].duration.seconds)}
β π *ππΈEWS:* ${`${MilesNumber(yt_play[0].views)}`}
β π€ *π°ππHπΎπ:* ${yt_play[0].author.name}
β β―οΈ *URL:* ${yt_play[0].author.url}
β π *πΈπ³:* ${yt_play[0].videoId}
β πͺ¬ *πYPE:* ${yt_play[0].type}
β π *π»πΈπ½πΊ:* ${yt_play[0].url}`.trim();
    const buttons = [
      {
        buttonId: `#ytmp3 ${yt_play[0].url}`,
        buttonText: { displayText: "π΅ πππππ π΅" },
        type: 1,
      },
      {
        buttonId: `#ytmp4 ${yt_play[0].url}`,
        buttonText: { displayText: "π₯ πππππ π₯" },
        type: 1,
      },
      {
        buttonId: `#playlist ${text}`,
        buttonText: { displayText: "π MORE π" },
        type: 1,
      },
    ];
    let buttonMessage = {
      document: { url: "https://wa.me/917605902011" },
      fileName: "β πΏ REPRODUCTION",
      mimetype: "application/vnd.ms-excel",
      caption: texto1,
      fileLength: "99999999999999",
      mentions: [m.sender],
      footer: wm,
      buttons: buttons,
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: true,
          title: `${yt_play[0].title}`,
          mediaType: 2,
          previewType: "VIDEO",
          thumbnailUrl: yt_play[0].image,
          mediaUrl: `${yt_play[0].url}`,
          sourceUrl: `https://github.com/Guru322/GURU-BOT`,
        },
      },
    };
    conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  } catch {
    try {
      let vid2 = await (
        await fetch(
          `https://api.lolhuman.xyz/api/ytsearch?apikey=${lolkeysapi}&query=${text}`
        )
      ).json();
      let { videoId, title, views, published, thumbnail } = await vid2
        .result[0];
      const url = "https://www.youtube.com/watch?v=" + videoId;
      let ytLink = await fetch(
        `https://api.lolhuman.xyz/api/ytplay2?apikey=${lolkeysapi}&query=${text}`
      );
      let jsonn = await ytLink.json();
      let aud = await jsonn.result.audio;
      let capt = `β π *ππΈπLE:* ${title}\nβ π *πΏππ±π»πΈπ²ED:* ${published}\nβ π *ππΈEWS:* ${views}\nβ π *π»πΈπ½πΊ:* ${url}`;
      const buttons = [
        {
          buttonId: `#playlist ${title}`,
          buttonText: { displayText: "π πORE π" },
          type: 1,
        },
      ];
      const buttonMessage = {
        image: { url: thumbnail },
        caption: capt,
        footer: "*downloading α΄α΄α΄Ιͺα΄, wait for a moment...*",
        buttons: buttons,
        headerType: 4,
      };
      let msg = await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

      conn.sendMessage(
        m.chat,
        {
          audio: { url: aud },
          mimetype: "audio/mp4",
          fileName: `${title}.mp3`,
        },
        { quoted: msg }
      );
    } catch {
      throw "*[βππππβ] π΄rror, Downloading audio*";
    }
  }
};
handler.help = ["play", "play2"].map((v) => v + " < query >");
handler.tags = ["downloader"];
handler.command = /^play2?$/i;
export default handler;
