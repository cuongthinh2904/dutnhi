exports.config = {
  name: '4k',
  version: '0.0.1',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'Tăng chất lượng ảnh lên 4k',
  commandCategory: 'Tiện ích',
  usages: '[image]',
  cooldowns: 3
};
let eta = 3;
exports.run = async o=> {
  let send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);

  if (o.event.type != 'message_reply')return send(`Làm ơn hãy phản hồi hình ảnh nào đó!`);
  send(`Tiến hành tăng độ phân giải cho ${o.event.messageReply.attachments.length} ảnh (ước tính ${o.event.messageReply.attachments.length*eta}s), chờ xíu ...`);

  let stream = [];
  let exec_time = 0;
  for (let i of o.event.messageReply.attachments)try {
    let res = await require('axios').get(encodeURI(`https:/api.namvns.repl.co/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp"}`), {
      responseType: 'stream',
    });

    exec_time+=+res.headers.exec_time;
    eta = res.headers.exec_time/1000<<0;
    res.data.path = 'tmp.png';
    stream.push(res.data);
  } catch (e) {};

  send({
    body: `Tăng độ phân giải lên 4k hoàn tất ☑ (thời gian thực thi ${exec_time/1000<<0}s)`,
    attachment: stream,
  });
};