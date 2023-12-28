module.exports.config = {
  name: "taixiu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "DungUwU mod by Niio-team",
  description: "taixiu nhiều người có ảnh",
  commandCategory: "Game",
  usages: "[create/leave/start] [tài/xỉu]",
  usePrefix: false,
  cooldowns: 3,
};

const axios = require("axios");

module.exports.languages = {
  vi: {
    missingInput: "❎ Số Tiền đặt cược không hợp lệ",
    wrongInput: "❎ Nhập liệu không hợp lệ",
    moneyBetNotEnough: "❎ Số tiền bạn đặt lớn hơn số dư của bạn",
    limitBet: "❎ Số coin đặt không được dưới 50$",
    alreadyHave: "❎ Đang có 1 ván tài xỉu diễn ra ở nhóm này",
    alreadyBet: "✅ Bạn đã thay đổi mức cược là %1$ vào %2.",
    createSuccess:
      "✅ Tạo thành công để tham gia cược ghi: tài/xỉu + tiền cược\n\n📌 Trong một khoảng thời gian nếu nhà cái không xổ bàn tài xỉu sẽ tự hủy và phạt tiền nhà cái bù cho người chơi",
    noGame: "❎ Nhóm của bạn không có ván tài xỉu nào đang diễn ra cả!",
    betSuccess: "✅ Đặt thành công %1$ vào %2",
    notJoined: "❎ Bạn chưa tham gia tài xỉu ở nhóm này!",
    outSuccess: "✅ Đã rời ván tài xỉu thành công, bạn sẽ được hoàn tiền!",
    shaking: "Đang lắc...",
    final: "🎲 KẾT QUẢ TÀI XỈU 🎲",
    notAuthor: "❎ Bạn không phải chủ phòng.",
    unknown: "❎ Câu lệnh không hợp lệ, để xem cách dùng, sử dụng: %1help %2",
    noPlayer: "❎ Hiện không có người đặt cược",
    info: "📌 Chủ phòng: %1\n🛑 Người tham gia:\n%2",
  },
};

const dice_images = [
  "https://i.imgur.com/Q3QfE4t.jpeg",
  "https://i.imgur.com/M3juJEW.jpeg",
  "https://i.imgur.com/Tn6tZeG.jpeg",
  "https://i.imgur.com/ZhOA9Ie.jpeg",
  "https://i.imgur.com/eQMdRmd.jpeg",
  "https://i.imgur.com/2GHAR0f.jpeg",
];

module.exports.run = async function ({
  api,
  event,
  args,
  getText,
  Users,
  Threads,
  Currencies,
}) {
  const request = require("request");
  const fs = require("fs");
  if (!fs.existsSync(__dirname + "/cache/taixiu.png")) {
    request("https://i.imgur.com/i2woeoT.jpeg").pipe(
      fs.createWriteStream(__dirname + "/cache/taixiu.png")
    );
  }
  if (!global.client.taixiu_ca) global.client.taixiu_ca = {};

  //DEFINE SOME STUFF HERE..
  const { senderID, messageID, threadID } = event;
  if (args.length == 0) {
    var abcd = {
      body: `🎲 TÀI XỈU 🎲\n${global.config.PREFIX}${this.config.name} create -> tạo bàn tài xỉu\n${global.config.PREFIX}${this.config.name} leave -> rời khỏi bàn tài xỉu\n${global.config.PREFIX}${this.config.name} xổ -> bắt đầu lắc xúc xắc\n${global.config.PREFIX}${this.config.name} end -> kết thúc bàn tài xỉu`,
      attachment: [fs.createReadStream(__dirname + "/cache/taixiu.png")],
    };
    return api.sendMessage(abcd, threadID, messageID);
  }
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  const moneyUser = (await getData(senderID)).money;
  const sendC = (msg, callback) =>
    api.sendMessage(msg, threadID, callback, messageID);
  const sendTC = async (msg, callback) =>
    api.sendMessage(msg, threadID, callback);
  const sendT = (msg) => sendTC(msg, () => {});
  const send = (msg) => sendC(msg, () => {});
  const threadSetting =
    (await Threads.getData(String(event.threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  //HERE COMES SWITCH CASE...
 // console.log(global.client.taixiu_ca[threadID])
  switch (args[0]) {
    case "create": {
      if (threadID in global.client.taixiu_ca) {
        if (!global.client.taixiu_ca[threadID].play) {
          if (global.client.taixiu_ca[threadID].id === senderID) {
            if (global.client.taixiu_ca[threadID].create === "false") {
              const minutes = Math.floor(global.client.taixiu_ca[threadID].time / 60);

              const Seconds = global.client.taixiu_ca[threadID].time % 60;
              return sendC(
                `❎ Bàn cũ end chưa được 2p vui lòng chờ hết ${minutes + 'p' + Seconds+'s'} hãy tạo bàn mới\n\n📌 Mỗi người chỉ có thể tạo 2p một lần`,
                (e, info) => {
                  global.client.handleReaction.push({
                    type: "create",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID,
                    moneyUser,
                  });
                }
              );
            }
          } else {
            const idB = await generateId();
            sendTC(getText("createSuccess"), async () => {
              global.client.taixiu_ca[threadID] = {
                id: idB,
                players: 0,
                data: {},
                play: true,
                status: "pending",
                author: senderID,
              };
            });
            timeStart(idB);
            return;
          }
        }

        if (global.client.taixiu_ca[threadID].play) {
          return send(getText("alreadyHave"));
        }
        return;
      }
      const idB = await generateId();
      sendTC(getText("createSuccess"), async () => {
        global.client.taixiu_ca[threadID] = {
          id: idB,
          players: 0,
          data: {},
          play: true,
          status: "pending",
          author: senderID,
        };
      });
      timeStart(idB);
      return;
    }
    case "end": {
      if (global.client.taixiu_ca[threadID].author !== senderID) {
        const threadInfo = await api.getThreadInfo(threadID);
        const find = threadInfo.adminIDs.find((el) => el.id === senderID);
        if (find) {
          var msg = "QTV yêu cầu kết thúc bàn tài xỉu\n",
            num = 1;
          for (i in global.client.taixiu_ca[threadID].data) {
            name = (await Users.getNameUser(i)) || `Player ${i}`; //GET NAME
            msg += `\n${num++}. ${name}`;
          }
          msg += `\n\nNhững người có tên ở trên vui lòng thả tim để xác nhận hủy bàn!`;
          return sendC(msg, (e, info) => {
            global.client.handleReaction.push({
              type: "end",
              name: this.config.name,
              author: senderID,
              messageID: info.messageID,
              data: global.client.taixiu_ca[threadID].data,
            });
          });
        } else return send(getText("notAuthor"));
      }
      for (let id in global.client.taixiu_ca[threadID].data) {
        await increaseMoney(
          id,
          String(global.client.taixiu_ca[threadID].data[id].bet)
        );
      }

      delete global.client.taixiu_ca[threadID];
        global.client.taixiu_ca[threadID] = {
          id: senderID,
          create: "false",
          time: 120
        };
      send("Đã xóa bàn thành công!");
      timeCreate(threadID);
      break;
    }
    case "info": {
      //SMALL CHECK
      if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
      console.log(global.client.taixiu_ca[threadID]);
      if (global.client.taixiu_ca[threadID].players == 0)
        return send(getText("noPlayer"));
      let name = "";
      let tempL = [];
      let nameAuthor =
        (await Users.getNameUser(global.client.taixiu_ca[threadID].author)) ||
        "Player"; //GET NAME AUTHOR
      for (e in global.client.taixiu_ca[threadID].data) {
        name = (await Users.getNameUser(e)) || "Player"; //GET NAME PLAYER
        tempL.push(
          `${name} đặt '${global.client.taixiu_ca[threadID].data[e].name}' số tiền: ${formatNumber(global.client.taixiu_ca[threadID].data[e].bet)}$`
        );
      }
      send(getText("info", nameAuthor, tempL.join("\n")));
      return;
    }
    default: {
    }
  }
  async function timeStart(idB) {
    setTimeout(async () => {
      var tong = 0,
        msg = "[ Danh sách người chơi ]";
      if (!global.client.taixiu_ca[threadID].play) return;
      if (global.client.taixiu_ca[threadID].id !== idB) return;
      for (i in global.client.taixiu_ca[threadID].data) {
        var name = (await Users.getNameUser(i)) || "Player";
        await increaseMoney(
          i,
          global.client.taixiu_ca[threadID].data[i].bet * 2
        );
        msg += `\n\n${name}:  ${global.client.taixiu_ca[threadID].data[senderID].name}`;
        tong = tong + global.client.taixiu_ca[threadID].data[i].bet;
      }
      await decreaseMoney(senderID, tong);
      msg +=
        "\n\n📌 Đặt cược quá lâu, tiến hành hủy bàn và hoàn tiền + bù tiền";
      api.sendMessage(msg, threadID);
      delete global.client.taixiu_ca[threadID];
    }, 60 * 1000 * 5);
  }
};

module.exports.handleEvent = async function ({
  api,
  event,
  args,
  Currencies,
  getText,
  Users
}) {
  try{
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  const { senderID, threadID, messageID, body } = event;
  if (!global.client.taixiu_ca) return;
  if (!global.client.taixiu_ca[threadID]) return;
  if (!global.client.taixiu_ca[threadID].play) return;
  const moneyUser = (await getData(senderID)).money;
  const sendC = (msg, callback) =>
    api.sendMessage(msg, threadID, callback, messageID);
  const sendTC = async (msg, callback) =>
    api.sendMessage(msg, threadID, callback);
  const sendT = (msg) => sendTC(msg, () => {});
  const send = (msg) => sendC(msg, () => {});
if(event.body === '') return
 const type = event.args !== undefined ? event.args[0] : 'xx'
   // console.log(global.client.taixiu_ca[threadID])
 switch(type){
   case 'end':
   case 'End': {
   if (global.client.taixiu_ca[threadID].author !== senderID) {
        const threadInfo = await api.getThreadInfo(threadID);
        const find = threadInfo.adminIDs.find((el) => el.id === senderID);
        if (find) {
          if(lobal.client.taixiu_ca[threadID].data.length <= 0) {
             delete global.client.taixiu_ca[threadID];
        global.client.taixiu_ca[threadID] = {
          id: senderID,
          create: "false",
          time: 120
        };
      send("Đã xóa bàn thành công!");
      timeCreate(threadID);
            return
          }
          var msg = "QTV yêu cầu kết thúc bàn tài xỉu\n",
            num = 1;
          for (i in global.client.taixiu_ca[threadID].data) {
            name = (await Users.getNameUser(i)) || `Player ${i}`; //GET NAME
            msg += `\n${num++}. ${name}`;
          }
          msg += `\n\nNhững người có tên ở trên vui lòng thả tim để xác nhận hủy bàn!`;
          return sendC(msg, (e, info) => {
            global.client.handleReaction.push({
              type: "end",
              name: this.config.name,
              author: senderID,
              messageID: info.messageID,
              data: global.client.taixiu_ca[threadID].data,
            });
          });
        } else return send(getText("notAuthor"));
      }
      for (let id in global.client.taixiu_ca[threadID].data) {
        await increaseMoney(
          id,
          String(global.client.taixiu_ca[threadID].data[id].bet)
        );
      }

      delete global.client.taixiu_ca[threadID];
        global.client.taixiu_ca[threadID] = {
          id: senderID,
          create: "false",
          time: 120
        };
      send("Đã xóa bàn thành công!");
      timeCreate(threadID);
     break;
}
    case "Leave":
    case "leave": {
      //SMALL CHECK...
    
      if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
      if (!global.client.taixiu_ca[threadID].data[senderID])
        return send(getText("notJoined"));
      else {
        //REMOVING PLAYER
        global.client.taixiu_ca[threadID].players--;
        var bett = global.client.taixiu_ca[threadID].data[senderID].bet
          await increaseMoney(senderID, String(bett));
        delete global.client.taixiu_ca[threadID].data[senderID];
        send(getText("outSuccess"));
      }
      break;
    }
    case "Xổ":
    case "xổ": {
      try{
  //SMALL CHECK...
      if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
      if (global.client.taixiu_ca[threadID].author != senderID)
        return send(getText("notAuthor"));
      if (global.client.taixiu_ca[threadID].players == 0)
        return send(getText("noPlayer"));

      //GET SHAKING DICES GIF AND SEND
      //let shakingGif = (await axios.get('https://i.ibb.co/hMPgMT7/shaking.gif', { responseType: "stream" }).catch(e => console.log(e))).data;
      await api.sendMessage(
        {
          body: getText("shaking"),
          //attachment: shakingGif
        },
        threadID,
        async(err, info) =>
          setTimeout(
            async () =>
              await api.unsendMessage(info.messageID).then(async () => {
                await new Promise((resolve) => setTimeout(resolve, 500)); //A LITTLE DELAY...

                //GET DICES
                let _1st = Math.ceil(Math.random() * 6);
                let _2nd = Math.ceil(Math.random() * 6);
                let _3rd = Math.ceil(Math.random() * 6);

                //MAKING MSG...
                let name = "";
                let msg = getText("final");

                //GET IMAGES
                let dice_one_img = (
                  await axios
                    .get(dice_images[_1st - 1], { responseType: "stream" })
                    .catch((e) => console.log(e))
                ).data;
                let dice_two_img = (
                  await axios
                    .get(dice_images[_2nd - 1], { responseType: "stream" })
                    .catch((e) => console.log(e))
                ).data;
                let dice_three_img = (
                  await axios
                    .get(dice_images[_3rd - 1], { responseType: "stream" })
                    .catch((e) => console.log(e))
                ).data;
                let atms = [dice_one_img, dice_two_img, dice_three_img]; //ADD TO ARRAY

                //SPLIT 2 TYPE OF PLAYERS
                let win = [],
                  loss = [],
                  result;
                for (i in global.client.taixiu_ca[threadID].data) {
                  name = (await Users.getNameUser(i)) || "Player"; //GET NAME
                  var kq = (_1st + _2nd) + _3rd
                  const cuoc = global.client.taixiu_ca[threadID].data[i].name
                  const mons = global.client.taixiu_ca[threadID].data[i].bet
                 var results = kq <= 10 ? 'xỉu' : 'tài'
                  const kqt = cuoc === results ? "Win" : 'Lose'
                  const mont = mons * 2n;
                  // nam bi mom nen k nhan tin dc
                  if (kqt == "Win") {try{
                    win.push(
                      `${name} (${
                        global.client.taixiu_ca[threadID].data[i].name
                      }):\n+${formatNumber(
                        String(mont)
                      )}$`
                    );
                    await increaseMoney(
                      i,
                      String(mont)
                    );}catch(e){console.log(e)}
                  } 
                  else if (kqt == "Lose"){
                    loss.push(
                      `${name} (${
                        global.client.taixiu_ca[threadID].data[i].name
                      }):\n-${formatNumber(
                        mons
                      )}$`
                    );
                  }
                }
                msg += `\n\n${
                  win.length > 0
                    ? `Những người chơi thắng:\n──────────────\n${win.join("\n")}`
                    : ""
                }\n\n${
                  loss.length > 0
                    ? `Những người chơi thua:\n──────────────\n${loss.join("\n")}`
                    : ""
                }\n`;
                console.log(win,loss)
                //FINAL SEND
                sendC(
                  {
                    body: msg,
                    attachment: atms,
                  },
                  () => {
                    delete global.client.taixiu_ca[threadID]
                    global.client.taixiu_ca[threadID] = {
                    id: senderID,
                    create: "false",
                    time: 120
                  };
                  }
                );
                timeCreate(threadID);
                return;
              }),
            2400
          )
      );
    }catch(e){
    console.log(e)
    }
      break;
}
   case 'tài':
   case 'Tài':
   case 'Xỉu':
   case 'xỉu':{
  const bod = event.args;
  var input = bod[0],
    money = bod[1],
    moneyBet;
     if(isNaN(money)) {
       if(money !== 'all'){
       return api.sendMessage('Money phải là một số!', event.threadID)
       } 
     }
  if (["tài", "xỉu"].includes(input.toLowerCase())) {
    //LITTLE CHECK...
    if (!["Tài", "tai", "tài", "Xỉu", "xỉu", "xiu"].includes(input))
      return send("Vui lòng chọn tài or xỉu");
    if (!global.client.taixiu_ca[threadID]) return send(getText("noGame"));
    if (bod.length < 2) return send(getText("wrongInput"));
    moneyBet = money === "all" ? moneyUser : BigInt(money)

    if ( moneyBet < 1n) return send(getText("missingInput"));
    if (moneyBet > moneyUser) return send(getText("moneyBetNotEnough"));
    if (moneyBet < 50n) return send(getText("limitBet"));
    if (threadID in global.client.taixiu_ca) {
      if (global.client.taixiu_ca[threadID].status == "pending") {
        var luachon = input;

        //CHECK INPUT
        if (["Xỉu", "xiu", "xỉu"].includes(luachon)) luachon = "xỉu";
        if (["Tài", "tài", "tai"].includes(luachon)) luachon = "tài";

        if (!global.client.taixiu_ca[threadID].data[senderID])
          global.client.taixiu_ca[threadID].players++;

        if (global.client.taixiu_ca[threadID].data[senderID]) {
          await increaseMoney(
        senderID,
        String(global.client.taixiu_ca[threadID].data[senderID].bet)
      );
      await decreaseMoney(senderID, String(moneyBet));
      global.client.taixiu_ca[threadID].data[senderID] = {
        name: luachon,
        bet: moneyBet,
      };
  return sendC(getText("alreadyBet", formatNumber(moneyBet), luachon));
        } else {
              global.client.taixiu_ca[threadID].data[senderID] = {
                name: luachon,
                bet: moneyBet,
              };
              
          await decreaseMoney(senderID, String(moneyBet));
          return sendC(
            getText("betSuccess", formatNumber(moneyBet), luachon));
        }
      }
    }
    return;
  }
 }
 }
  }catch(e){
    console.log(e)
  }
};

module.exports.handleReaction = async ({
  api,
  event,
  handleReaction,
  getText,
  Currencies,
}) => {
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  const { author, moneyBet, luachon, moneyUser, type, data } = handleReaction;
  const { threadID, userID, messageID, reaction, senderID } = event;
  const sendC = (msg, callback) =>
    api.sendMessage(msg, threadID, callback, messageID);
  if (reaction !== "❤") return;
  if (type === "create") {
    if (userID !== author) return;
    if (moneyUser < 1000n)
      return api.sendMessage(
        "Số dư của bạn ít hơn 1,000$ nên không đủ điều kiện để tạo bàn!",
        threadID
      );
    var money_output = moneyUser * (10n / 100n);
    await decreaseMoney(userID, (money_output));
    global.client.taixiu_ca[threadID] = {
      create: true,
    };
    const idB = await generateId();
    setTimeout(async () => {
      var tong = 0,
        msg = "[ Danh sách người chơi ]";
      if (global.client.taixiu_ca[threadID].id !== idB) return;
      for (i in global.client.taixiu_ca[threadID].data) {
        var name = (await Users.getNameUser(i)) || "Player";
        await increaseMoney(
          i,
          String(global.client.taixiu_ca[threadID].data[i].bet * 2n
        ));
        msg += `\n\n⛔ ${name}:  ${global.client.taixiu_ca[threadID].data[senderID].name}`;
        tong = tong + global.client.taixiu_ca[threadID].data[i].bet;
      }
      await decreaseMoney(senderID, tong);
      msg +=
        "\n\n📌 Đặt cược quá lâu, tiến hành hủy bàn và hoàn tiền";
      api.sendMessage(msg, threadID);
      delete global.client.taixiu_ca[threadID];
    }, 60 * 1000 * 5);

    return sendC(getText("createSuccess"), async () => {
      global.client.taixiu_ca[threadID] = {
        id: idB,
        players: 0,
        data: {},
        play: true,
        status: "pending",
        author: userID,
      };
    });
  }
  if (type === "end") {
    for (let id in data) {
      if (id === userID) {
        await increaseMoney(
          id,
          global.client.taixiu_ca[threadID].data[id].bet
        )
        delete global.client.taixiu_ca[threadID].data[userID];
      }
      var lengths = Object.keys(global.client.taixiu_ca[threadID].data).length;
      if (lengths === 0) {
        delete global.client.taixiu_ca[threadID];
        global.client.taixiu_ca[threadID] = {
          id: author,
          create: "false",
          time: 120
        };
        timeCreate(threadID);
        return api.sendMessage("Đã xác nhận xóa bàn!", threadID);
      }
    }
  }
  // if (userID !== author) return;
  //     await increaseMoney(
  //       author,
  //       (global.client.taixiu_ca[threadID].data[author].bet)
  //     );
  //     await decreaseMoney(author, (moneyBet));
  //     global.client.taixiu_ca[threadID].data[author] = {
  //       name: luachon,
  //       bet: moneyBet,
  //     };
  // return sendC(getText("alreadyBet", formatNumber(moneyBet), luachon));
};

function formatNumber(number) {
  return number.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateId() {
  const min = 100000;
  const max = 999999;
  const randomSixDigitId = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomSixDigitId;
}

async function timeCreate(threadID) {
  if (!global.client.taixiu_ca[threadID]) return;
  if (global.client.taixiu_ca[threadID].create !== "false") return;
  timeOut(threadID)
  setTimeout(() => {
    if (!global.client.taixiu_ca[threadID]) return;
    if (global.client.taixiu_ca[threadID].create !== "false") return;
    global.client.taixiu_ca[threadID] = {
      create: true,
    };
  }, 60 * 1000 * 3);
}

async function timeOut(threadID){
  setInterval(()=>{
    global.client.taixiu_ca[threadID].time--
  },1000)
}