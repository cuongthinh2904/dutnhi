const axios = require('axios');
const moment = require("moment-timezone");

module.exports.config = {
  name: "upt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "DuyVuong",
  description: "Random ảnh theo api - uptime",
  commandCategory: "Thống kê",
  cooldowns: 3
};
function byte2mb(bytes) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0, n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}
module.exports.run = async ({ api, event, Users }) => {
  const os = require('os');
  const platform = os.platform();
  const arch = os.arch();
  const cpu_model = os.cpus()[0].model;
  const core = os.cpus().length;
  const speed = os.cpus()[0].speed;
  const byte_fm = os.freemem();
  const byte_tm = os.totalmem();
  const gb_fm = (byte_fm / (1024 * 1024 * 1024)).toFixed(2);
  let gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
  const time = process.uptime(),
    hours = Math.floor(time / (60 * 60)),
    minutes = Math.floor((time % (60 * 60)) / 60),
    seconds = Math.floor(time % 60);
  const timeStart = Date.now();
  let name = await Users.getNameUser(event.senderID);
  let threadInfo = await api.getThreadInfo(event.threadID);
  let threadName = threadInfo.threadName;
 
 api.sendMessage(`⏰ Bây Giờ Là: ${gio}\n⌛ Thời Gian Online: ${hours}:${minutes}:${seconds}\n✏️ Dấu Lệnh: ${global.config.PREFIX}\n👥 Tổng Box: ${global.data.allThreadID.length}\n👤 Tổng Người Dùng: ${global.data.allUserID.length}\n🤖 In4 System:\n💻 Hệ điều hành: ${platform}\n👾 Kiểu Arch: ${arch}\n⚙️ CPU: ${core} core(s) - ${cpu_model} - ${speed}MHz\n⚒️ Trống: ${gb_fm}GB\n📌 Ping: ${Date.now() - timeStart}ms\n${name} - ${threadName}`, event.threadID, event.messageID);
 
}