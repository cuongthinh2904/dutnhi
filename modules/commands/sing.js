const fs = require('fs');
const ytdl = require("ytdl-core");
const { resolve } = require('path');
const moment = require("moment-timezone");
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
async function downloadMusicFromYoutube(link, path) {
  var timestart = Date.now();
  if(!link) return 'Thiếu link'
  var resolveFunc = function () { };
  var rejectFunc = function () { };
  var returnPromise = new Promise(function (resolve, reject) {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
    ytdl(link, {
            filter: format =>
                format.quality == 'tiny' && format.audioBitrate == 128 && format.hasAudio == true
        }).pipe(fs.createWriteStream(path))
        .on("close", async () => {
            var data = await ytdl.getInfo(link)
            var result = {
                title: data.videoDetails.title,
                dur: Number(data.videoDetails.lengthSeconds),
                viewCount: data.videoDetails.viewCount,
                likes: data.videoDetails.likes,
                uploadDate: data.videoDetails.uploadDate,
                sub: data.videoDetails.author.subscriber_count,
                author: data.videoDetails.author.name,
                timestart: timestart
            }
            resolveFunc(result)
        })
  return returnPromise
}
module.exports.config = {
    name: "sing",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm",
    commandCategory: "Tiện ích",
    usages: "[searchMusic]",
    cooldowns: 0
}

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const axios = require('axios')
    const { createReadStream, unlinkSync, statSync } = require("fs-extra")
    try {
        var path = `${__dirname}/cache/sing-${event.senderID}.mp3`
        var data = await downloadMusicFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body -1], path);
        if (fs.statSync(path).size > 26214400) return api.sendMessage('𝗞𝗵𝗼̂𝗻𝗴 𝘁𝗵𝗲̂̉ 𝗴𝘂̛̉𝗶 𝗳𝗶𝗹𝗲. 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝗰𝗵𝗼̣𝗻 𝗯𝗮̀𝗶 𝗵𝗮́𝘁 𝗸𝗵𝗮́𝗰!', event.threadID, () => fs.unlinkSync(path), event.messageID);
        api.unsendMessage(handleReply.messageID)
        return api.sendMessage({ 
            body: `======「 𝗠𝗨𝗦𝗜𝗖 」======\n\n→ Bài hát: ${data.title}\n→ Thời lượng: ${this.convertHMS(data.dur)}\n→ Ngày tải lên: ${data.uploadDate}\n→ Tên kênh: ${data.author}\n→ Lượt theo dõi: ${data.sub}\n→ Lượt xem: ${data.viewCount}\n→ Lượt thích: ${data.likes}\n→ Thời gian xử lý: ${Math.floor((Date.now()- data.timestart)/1000)} giây\n→ Link tải: https://www.y2meta.com/vi/youtube/${handleReply.link[event.body - 1]}\n\n⇆ㅤㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤㅤ↻`,
            attachment: fs.createReadStream(path)}, event.threadID, ()=> fs.unlinkSync(path), 
         event.messageID)

    }
    catch (e) { return console.log(e) }
}
module.exports.convertHMS = function(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (hours != '00' ? hours +':': '') + minutes+':'+seconds;
}
module.exports.run = async function ({ api, event, args }) {
  let axios = require('axios');
    if (args.length == 0 || !args) return api.sendMessage('» Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
    const keywordSearch = args.join(" ");
    var path = `${__dirname}/cache/sing-${event.senderID}.mp3`
    if (fs.existsSync(path)) { 
        fs.unlinkSync(path)
    }
    if (args.join(" ").indexOf("https://") == 0) {
        try {
            var data = await downloadMusicFromYoutube(args.join(" "), path);
            if (fs.statSync(path).size > 2621440000) return api.sendMessage('Không thể gửi file có thời gian từ 01:10:10 vui lòng chọn file không có âm thanh.', event.threadID, () => fs.unlinkSync(path), event.messageID);
            return api.sendMessage({ 
                body: `======「 𝗠𝗨𝗦𝗜𝗖 」======\n\n→ Bài hát: ${data.title}\n→ Thời lượng: ${this.convertHMS(data.dur)}\n→ Ngày tải lên: ${data.uploadDate}\n→ Tên kênh: ${data.author}\n→ Lượt theo dõi: ${data.sub}\n→ Lượt xem: ${data.viewCount}\n→ Lượt thích: ${data.likes}\n→ Thời gian xử lý: ${Math.floor((Date.now()- data.timestart)/1000)} giây\n→ Link tải: https://www.y2meta.com/vi/youtube/${handleReply.link[event.body - 1]}\n\n⇆ㅤㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤㅤ↻`,
                attachment: fs.createReadStream(path)}, event.threadID, ()=> fs.unlinkSync(path), 
            event.messageID)

        }
        catch (e) { return console.log(e) }
    } else {
          try {
            var link = [],
                msg = "",
                num = 0,
                numb = 0;
            var imgthumnail = []
            const Youtube = require('youtube-search-api');
            var data = (await Youtube.GetListByKeyword(keywordSearch, false,6)).items;
            for (let value of data) {
              link.push(value.id);
              let datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=AIzaSyANZ2iLlzjDztWXgbCgL8Oeimn3i3qd0bE`)).data;
              let channel = datac.items[0].snippet.channelTitle;
              num = num+=1
  if (num == 1) var num1 = "1"
  if (num == 2) var num1 = "2"
  if (num == 3) var num1 = "3"
  if (num == 4) var num1 = "4"
  if (num == 5) var num1 = "5"
  if (num == 6) var num1 = "6"
              msg += (`${num1}. ${value.title}\n🌐 Tên kênh: ${channel}\n⏰ Thời lượng: ${value.length.simpleText}\n📎 Link video: https://youtu.be/${value.id}\n\n`);
            }
            var body = `Có ${link.length} kết quả trùng với từ khóa tìm kiếm của bạn.\n━━━━━━━━━━━━━━━━━━\n${msg}📌 Hãy reply (phản hồi) chọn một trong những tìm kiếm trên!`
            return api.sendMessage({
              body: body
            }, event.threadID, (error, info) => global.client.handleReply.push({
              type: 'reply',
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              link
            }), event.messageID);
          } catch(e) {
            return api.sendMessage('Đã xảy ra lỗi, vui lòng thử lại trong giây lát!!\n' + e, event.threadID, event.messageID);
        }
    }
}