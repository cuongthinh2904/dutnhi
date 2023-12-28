exports.config = {
  name: 'rent',
  version: '2.0.0',
  hasPermssion: 1,
  credits: 'DC-Nam mod by Niiozic',
  description: 'Set data thuê bot', 
  commandCategory: 'Admin',
  usages: '[]',
  cooldowns: 0
};

let fs = require('fs');
if (!fs.existsSync(__dirname+'/data'))fs.mkdirSync(__dirname+'/data');
let path = __dirname+'/data/thuebot.json';
let data = [];
let save = ()=>fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path))save(); else data = require(path);
let form_mm_dd_yyyy = (input = '', split = input.split('/'))=>`${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date=>/^Invalid Date$/.test(new Date(date));
exports.run = async function(o) {
  let send = (msg, callback)=>{
    console.log(msg)
    o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
  }
  let prefix = (global.data.threadData.get(o.event.threadID) || {}).PREFIX||global.config.PREFIX;
  let info = data.find($=>$.t_id==o.event.threadID);
  try{
  switch (o.args[0]) {
    case 'add': {
      if(o.permssion < 2) return send('❎ Bạn không đủ quyền hạn để dùng chức năng này')
      if (!o.args[1])return send(`❎ Dùng ${prefix}${this.config.name} add + reply tin nhắn người cần thuê`);
      var uid = o.event.senderID;
       if(o.event.type == "message_reply") {
      uid = o.event.messageReply.senderID 
    }  else if (Object.keys(o.event.mentions).length > 0) {
        uid = Object.keys(o.event.mentions)[0];
    }
      let t_id = o.event.threadID;
      let id = uid;
      let time_start = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      let time_end = o.args[1];
      if (isNaN(id) || isNaN(t_id))return send(`❎ ID Không Hợp Lệ!`);
      if (invalid_date(form_mm_dd_yyyy(time_end)))return send(`❎ Thời Gian Không Hợp Lệ!`);
      data.push({
        t_id, id, time_start, time_end,
      });
      send(`✅ Set data box vào cơ sở dữ liệu thành công`);
    };
      break;
    case 'info': {
      let threadInfo = await o.api.getThreadInfo(info.t_id);
       send({body:`[ Thông Tin Thuê Bot ]\n────────────────\n👤 Tên người thuê: ${global.data.userName.get(info.id)}\n🌐 link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n────────────────\n🏘️ Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ ID Nhóm: ${info.t_id}\n📆 Ngày Thuê: ${info.time_start}\n⏳ Hết Hạn: ${info.time_end}\n📌 Còn ${(()=> {
      let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime()-(Date.now()+25200000);
      let days = (time_diff/(1000*60*60*24))<<0;
      let hour = (time_diff/(1000*60*60)%24)<<0;
      return `${days} ngày ${hour} giờ là hết hạn.`;
    })()}`,attachment: [await streamURL(`
https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), await streamURL(threadInfo.imageSrc)]
  });};
      break;
    case 'del': {
      if(o.permssion < 2) return send('❎ Bạn không đủ quyền hạn để dùng chức năng này')
      let t_id = o.event.threadID
      let id = o.event.senderID
      var findData = data.find(item=>item.t_id==t_id)
      if(!findData) return o.api.sendMessage("❎ Box này hiện chưa thuê bot",t_id)
      data.filter(item=>item.t_id!=t_id)
      send(`✅ Đã xóa data box thành công`)
      save()
      };
      break;
    case 'list': {
      if(o.permssion < 2) return send('❎ Bạn không đủ quyền hạn để dùng chức năng này')
      try{
        const page = 1;
        const itemsPerPage = 10;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        const validPage = Math.max(1, Math.min(page, totalPages));

        const startIndex = (validPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const msg = [];

        for (let i = startIndex; i < endIndex && i < data.length; i++) {
            msg.push(`${i + 1}. ${global.data.userName.get(data[i].id)}\n📝 Tình trạng: ${new Date(form_mm_dd_yyyy(data[i].time_end)).getTime() >= Date.now()+25200000?'Chưa Hết Hạn ✅': 'Đã Hết Hạn ❎'}\n🌾 Nhóm: ${(global.data.threadInfo.get(data[i].t_id) || {}).threadName}\nTừ: ${data[i].time_start}\nĐến: ${data[i].time_end}\n`);
        }

        o.api.sendMessage(`[ Danh Sách ] Trang ${validPage}/${totalPages}\n\n${msg.join('\n')}\n\n→ Reply (phản hồi) theo stt để xem chi tiết\n→ Reply del + stt để xóa khỏi danh sách\n→ Reply out + stt để thoát nhóm (cách nhau để chọn nhiều số)\n→ Reply giahan + stt để gia hạn\nVí dụ: 12/12/2023 => 1/1/2024\n→ Reply page + stt để xem các trang khác\nVí dụ: page 2`, o.event.threadID, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                event: o.event,
                data,
                num: endIndex,
                messageID: info.messageID,
                author: o.event.senderID
            });
        });

      }catch(e){
        console.log(e)
      }
    };
      break;
    default: send(`Dùng: ${prefix}${this.config.name} list -> Để xem danh sách thuê bot\nDùng: ${prefix}${this.config.name} add + reply tin nhắn người cần thuê -> Để thêm nhóm vào danh sách thuê bot\nVí dụ: ${prefix}${this.config.name} add 12/12/2023`)
      break;
  }
}catch(e){
  console.log(e)
}
  save();
};
exports.handleReply = async function(o) {
  let _ = o.handleReply;
  let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
  if (o.event.senderID != _.event.senderID)return;
  if (isFinite(o.event.args[0])) {
    let info = data[o.event.args[0]-1];
let threadInfo = await o.api.getThreadInfo(info.t_id);
    if (!info)return send(`⚠️ Stt không tồn tại!`);
    return send({body:`[ Thông Tin Thuê Bot ]\n────────────────\n👤 Tên người thuê: ${global.data.userName.get(info.id)}\n🌐 link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n────────────────\n🏘️ Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ ID Nhóm: ${info.t_id}\n📆 Ngày Thuê: ${info.time_start}\n⏳ Hết Hạn: ${info.time_end}\n📌 Còn ${(()=> {
      let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime()-(Date.now()+25200000);
      let days = (time_diff/(1000*60*60*24))<<0;
      let hour = (time_diff/(1000*60*60)%24)<<0;
      return `${days} ngày ${hour} giờ là hết hạn.`;
    })()}`,attachment: [await streamURL(`
https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), await streamURL(threadInfo.imageSrc)]
  });
  } else if (o.event.args[0].toLowerCase() == 'del') {
    o.event.args.slice(1).sort((a, b)=>b-a).forEach($=>data.splice($-1, 1));
    send(`✅ Đã xóa thành công!`);
  } else if (o.event.args[0].toLowerCase() == 'giahan') {
    let STT = o.event.args[1];
    let time_start = o.event.args[2];
    let time_end = o.event.args[4];  
    if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end)))return send(`❎ Thời Gian Không Hợp Lệ!`);    
    if (!data[STT-1])return send(`⚠️ Stt không tồn tại`);   
    let $ = data[STT-1];   
    $.time_start = time_start;
    $.time_end = time_end;
    send(`✅ Đã gia hạn nhóm thành công!`);
  } else if (o.event.args[0].toLowerCase() == 'out') {
    for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i-1].t_id);   
    send(`✅ Đã out nhóm theo yêu cầu`);
  } else if(o.event.args[0].toLowerCase() == 'page') {
    const page = !isNaN(o.event.args[1]) ? o.event.args[1] : 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const validPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const msg = [];

    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        msg.push(`${i + 1}. ${global.data.userName.get(data[i].id)}\n📝 Tình trạng: ${new Date(form_mm_dd_yyyy(data[i].time_end)).getTime() >= Date.now()+25200000?'Chưa Hết Hạn ✅': 'Đã Hết Hạn ❎'}\n🌾 Nhóm: ${(global.data.threadInfo.get(data[i].t_id) || {}).threadName}\nTừ: ${data[i].time_start}\nĐến: ${data[i].time_end}\n`);
    }

    o.api.sendMessage(`[ Danh Sách ] Trang ${validPage}/${totalPages}\n\n${msg.join('\n')}\n\n→ Reply (phản hồi) theo stt để xem chi tiết\n→ Reply del + stt để xóa khỏi danh sách\n→ Reply out + stt để thoát nhóm (cách nhau để chọn nhiều số)\n→ Reply giahan + stt để gia hạn\nVí dụ: 12/12/2023 => 1/1/2024\n→ Reply page + stt để xem các trang khác\nVí dụ: page 2`, o.event.threadID, (err, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            event: o.event,
            data,
            num: endIndex,
            messageID: info.messageID,
            author: o.event.senderID
        });
    });
  }
  save();
};
async function streamURL(url, mime = 'jpg') {
        const dest = `${__dirname}/data/${Date.now()}.${mime}`,
            downloader = require('image-downloader'),
            fse = require('fs-extra');
        await downloader.image({
            url, dest
        });
        setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
        return fse.createReadStream(dest);
    };