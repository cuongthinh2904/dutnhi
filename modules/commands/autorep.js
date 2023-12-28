const {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  unlinkSync,
  createReadStream,
} = require("fs-extra");
const { join, resolve } = require("path");
module.exports.config = {
  name: "autorep",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "DEV NDK & Dũngkon", //ý tưởng bới Quốc Vòng
  description: "autorep ",
  commandCategory: "Tiện ích",
  usages: "autorep",
  cooldowns: 5,
};

module.exports.run = async function ({ event, args, api }) {
  try {
    function short(str) {
      let narrow = str.indexOf(" -> ");
      if (narrow == -1) return { status: false, message: "Sai format." };
      let sI = str.slice(0, narrow);
      let sO = str.slice(narrow + 4, str.length);
      if (sI == sO)
        return { status: false, message: "📌Input và output giống nhau." };
      else if (!sI || !sO)
        return {
          status: false,
          message: `📌Chưa nhập ${!sI ? "input" : "output"}.`,
        };
      else return { status: true, sI, sO };
    }
    function uid() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    if (existsSync(join(__dirname, "src", "auto_chat", "data.json"))) {
      const dataThread = JSON.parse(
        readFileSync(join(__dirname, "src", "auto_chat", "data.json"), "utf8")
      );
      switch (args[0]) {
        case "text":
          const getShort = short(args.slice(1).join(" "));
          if (getShort.status) {
            if (dataThread.some((item) => item.threadID == event.threadID)) {
              const threadShort = dataThread.find(
                (item) => item.threadID == event.threadID
              );
              if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                return api.sendMessage(
                  "📌auto rep này đã tồn tại.",
                  event.threadID,
                  event.messageID
                );
              else {
                threadShort.autorep.push({
                  type: "text",
                  sI: getShort.sI,
                  sO: getShort.sO,
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else {
              dataThread.push({
                threadID: event.threadID,
                autorep: [
                  {
                    type: "text",
                    sI: getShort.sI,
                    sO: getShort.sO,
                  },
                ],
              });
              writeFileSync(
                resolve(__dirname, "src", "auto_chat", "data.json"),
                JSON.stringify(dataThread, null, 4)
              );
              return api.sendMessage(
                `📌Đã thêm: ${getShort.sI}.`,
                event.threadID,
                event.messageID
              );
            }
          } else
            return api.sendMessage(
              getShort.message,
              event.threadID,
              event.messageID
            );
        case "icon":
          if (event.type == "message_reply") {
            const getShort = short(args.slice(1).join(" "));
            if (event.messageReply.attachments[0])
              return api.sendMessage(
                `📌Vui lòng reply icon`,
                event.threadID,
                event.messageID
              );
            if (getShort.status) {
              if (dataThread.some((item) => item.threadID == event.threadID)) {
                const threadShort = dataThread.find(
                  (item) => item.threadID == event.threadID
                );
                if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                  return api.sendMessage(
                    "📌auto rep này đã tồn tại.",
                    event.threadID,
                    event.messageID
                  );
                else {
                  threadShort.autorep.push({
                    type: "icon",
                    sI: getShort.sI,
                    sO: getShort.sO,
                    icon: event.messageReply.body,
                  });
                  writeFileSync(
                    resolve(__dirname, "src", "auto_chat", "data.json"),
                    JSON.stringify(dataThread, null, 4)
                  );
                  return api.sendMessage(
                    `Đã thêm: ${getShort.sI}.`,
                    event.threadID,
                    event.messageID
                  );
                }
              } else {
                dataThread.push({
                  threadID: event.threadID,
                  autorep: [
                    {
                      type: "icon",
                      sI: getShort.sI,
                      sO: getShort.sO,
                      icon: event.messageReply.body,
                    },
                  ],
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else
              return api.sendMessage(
                getShort.message,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Bạn phải reply 1 icon nào đó`,
              event.threadID,
              event.messageID
            );
        case "stick":
          if (event.type == "message_reply") {
            const getShort = short(args.slice(1).join(" "));
            if (
              !event.messageReply.attachments[0] ||
              event.messageReply.attachments[0].type !== "sticker"
            )
              return api.sendMessage(
                `📌Vui lòng reply sticker`,
                event.threadID,
                event.messageID
              );
            if (getShort.status) {
              if (dataThread.some((item) => item.threadID == event.threadID)) {
                const threadShort = dataThread.find(
                  (item) => item.threadID == event.threadID
                );
                if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                  return api.sendMessage(
                    "📌auto rep này đã tồn tại.",
                    event.threadID,
                    event.messageID
                  );
                else {
                  threadShort.autorep.push({
                    type: "sticker",
                    sI: getShort.sI,
                    sO: getShort.sO,
                    sticker: event.messageReply.attachments[0].stickerID,
                  });
                  writeFileSync(
                    resolve(__dirname, "src", "auto_chat", "data.json"),
                    JSON.stringify(dataThread, null, 4)
                  );
                  return api.sendMessage(
                    `📌Đã thêm: ${getShort.sI}.`,
                    event.threadID,
                    event.messageID
                  );
                }
              } else {
                dataThread.push({
                  threadID: event.threadID,
                  autorep: [
                    {
                      type: "sticker",
                      sI: getShort.sI,
                      sO: getShort.sO,
                      sticker: event.messageReply.attachments[0].stickerID,
                    },
                  ],
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else
              return api.sendMessage(
                getShort.message,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Bạn phải reply 1 sticker nào đó`,
              event.threadID,
              event.messageID
            );
        case "gif":
          if (event.type == "message_reply") {
            if (
              !existsSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                )
              )
            ) {
              mkdirSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                ),
                { recursive: true }
              );
            }
            const getShort = short(args.slice(1).join(" "));
            if (
              !event.messageReply.attachments[0] ||
              event.messageReply.attachments[0].type !== "animated_image"
            )
              return api.sendMessage(
                `📌Vui lòng reply ảnh GIF.`,
                event.threadID,
                event.messageID
              );
            if (getShort.status) {
              const nameFile = `${event.threadID}_${uid()}.gif`;
              const path = resolve(
                __dirname,
                "src",
                "auto_chat",
                "other_data",
                `${event.threadID}`,
                nameFile
              );
              await global.utils.downloadFile(
                event.messageReply.attachments[0].url,
                path
              );
              if (dataThread.some((item) => item.threadID == event.threadID)) {
                const threadShort = dataThread.find(
                  (item) => item.threadID == event.threadID
                );
                if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                  return api.sendMessage(
                    "📌auto rep này đã tồn tại.",
                    event.threadID,
                    event.messageID
                  );
                else {
                  threadShort.autorep.push({
                    type: "gif",
                    sI: getShort.sI,
                    sO: getShort.sO,
                    path: `src/auto_chat/other_data/${event.threadID}/${nameFile}`,
                  });
                  writeFileSync(
                    resolve(__dirname, "src", "auto_chat", "data.json"),
                    JSON.stringify(dataThread, null, 4)
                  );
                  return api.sendMessage(
                    `📌Đã thêm: ${getShort.sI}.`,
                    event.threadID,
                    event.messageID
                  );
                }
              } else {
                dataThread.push({
                  threadID: event.threadID,
                  autorep: [
                    {
                      type: "gif",
                      sI: getShort.sI,
                      sO: getShort.sO,
                      path: `src/auto_chat/other_data/${event.threadID}/${nameFile}`,
                    },
                  ],
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else
              return api.sendMessage(
                getShort.message,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Bạn phải reply 1 ảnh GIF nào đó`,
              event.threadID,
              event.messageID
            );
        case "img":
          if (event.type == "message_reply") {
            if (
              !existsSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                )
              )
            ) {
              mkdirSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                ),
                { recursive: true }
              );
            }
            const getShort = short(args.slice(1).join(" "));
            if (
              !event.messageReply.attachments[0] ||
              event.messageReply.attachments[0].type !== "photo"
            )
              return api.sendMessage(
                `📌Vui lòng reply hình ảnh.`,
                event.threadID,
                event.messageID
              );
            if (getShort.status) {
              let pathName;
              if (event.messageReply.attachments.length > 1) {
                const pathArray = [];
                for (const data of event.messageReply.attachments) {
                  const nameFile = `${event.threadID}_${uid()}.png`;
                  const path = resolve(
                    __dirname,
                    "src",
                    "auto_chat",
                    "other_data",
                    `${event.threadID}`,
                    nameFile
                  );
                  await global.utils.downloadFile(data.url, path);
                  pathArray.push(
                    `src/auto_chat/other_data/${event.threadID}/${nameFile}`
                  );
                }
                pathName = pathArray;
              } else {
                const nameFile = `${event.threadID}_${uid()}.png`;
                const path = resolve(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`,
                  nameFile
                );
                await global.utils.downloadFile(
                  event.messageReply.attachments[0].url,
                  path
                );
                pathName = `src/auto_chat/other_data/${event.threadID}/${nameFile}`;
              }
              if (dataThread.some((item) => item.threadID == event.threadID)) {
                const threadShort = dataThread.find(
                  (item) => item.threadID == event.threadID
                );
                if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                  return api.sendMessage(
                    "📌auto rep này đã tồn tại.",
                    event.threadID,
                    event.messageID
                  );
                else {
                  threadShort.autorep.push({
                    type: "image",
                    sI: getShort.sI,
                    sO: getShort.sO,
                    path: pathName,
                  });
                  writeFileSync(
                    resolve(__dirname, "src", "auto_chat", "data.json"),
                    JSON.stringify(dataThread, null, 4)
                  );
                  return api.sendMessage(
                    `📌Đã thêm: ${getShort.sI}.`,
                    event.threadID,
                    event.messageID
                  );
                }
              } else {
                dataThread.push({
                  threadID: event.threadID,
                  autorep: [
                    {
                      type: "image",
                      sI: getShort.sI,
                      sO: getShort.sO,
                      path: pathName,
                    },
                  ],
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else
              return api.sendMessage(
                getShort.message,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Bạn phải reply ít nhất 1 ảnh nào đó`,
              event.threadID,
              event.messageID
            );
        case "video":
          if (event.type == "message_reply") {
            if (
              !existsSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                )
              )
            ) {
              mkdirSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                ),
                { recursive: true }
              );
            }
            const getShort = short(args.slice(1).join(" "));
            if (
              !event.messageReply.attachments[0] ||
              event.messageReply.attachments[0].type !== "video"
            )
              return api.sendMessage(
                `📌Vui lòng reply video.`,
                event.threadID,
                event.messageID
              );
            if (getShort.status) {
              const nameFile = `${event.threadID}_${uid()}.mp4`;
              const path = resolve(
                __dirname,
                "src",
                "auto_chat",
                "other_data",
                `${event.threadID}`,
                nameFile
              );
              await global.utils.downloadFile(
                event.messageReply.attachments[0].url,
                path
              );
              if (dataThread.some((item) => item.threadID == event.threadID)) {
                const threadShort = dataThread.find(
                  (item) => item.threadID == event.threadID
                );
                if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                  return api.sendMessage(
                    "📌auto rep này đã tồn tại.",
                    event.threadID,
                    event.messageID
                  );
                else {
                  threadShort.autorep.push({
                    type: "video",
                    sI: getShort.sI,
                    sO: getShort.sO,
                    path: `src/auto_chat/other_data/${event.threadID}/${nameFile}`,
                  });
                  writeFileSync(
                    resolve(__dirname, "src", "auto_chat", "data.json"),
                    JSON.stringify(dataThread, null, 4)
                  );
                  return api.sendMessage(
                    `📌Đã thêm: ${getShort.sI}.`,
                    event.threadID,
                    event.messageID
                  );
                }
              } else {
                dataThread.push({
                  threadID: event.threadID,
                  autorep: [
                    {
                      type: "video",
                      sI: getShort.sI,
                      sO: getShort.sO,
                      path: `src/auto_chat/other_data/${event.threadID}/${nameFile}`,
                    },
                  ],
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else
              return api.sendMessage(
                getShort.message,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Bạn phải reply 1 video nào đó`,
              event.threadID,
              event.messageID
            );
        case "voice":
          if (event.type == "message_reply") {
            if (
              !existsSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                )
              )
            ) {
              mkdirSync(
                join(
                  __dirname,
                  "src",
                  "auto_chat",
                  "other_data",
                  `${event.threadID}`
                ),
                { recursive: true }
              );
            }
            const getShort = short(args.slice(1).join(" "));
            if (
              !event.messageReply.attachments[0] ||
              event.messageReply.attachments[0].type !== "audio"
            )
              return api.sendMessage(
                `📌Vui lòng reply voice.`,
                event.threadID,
                event.messageID
              );
            if (getShort.status) {
              const nameFile = `${event.threadID}_${uid()}.m4a`;
              const path = resolve(
                __dirname,
                "src",
                "auto_chat",
                "other_data",
                `${event.threadID}`,
                nameFile
              );
              await global.utils.downloadFile(
                event.messageReply.attachments[0].url,
                path
              );
              if (dataThread.some((item) => item.threadID == event.threadID)) {
                const threadShort = dataThread.find(
                  (item) => item.threadID == event.threadID
                );
                if (threadShort.autorep.some((item) => item.sI == getShort.sI))
                  return api.sendMessage(
                    "📌auto rep này đã tồn tại.",
                    event.threadID,
                    event.messageID
                  );
                else {
                  threadShort.autorep.push({
                    type: "voice",
                    sI: getShort.sI,
                    sO: getShort.sO,
                    path: `src/auto_chat/other_data/${event.threadID}/${nameFile}`,
                  });
                  writeFileSync(
                    resolve(__dirname, "src", "auto_chat", "data.json"),
                    JSON.stringify(dataThread, null, 4)
                  );
                  return api.sendMessage(
                    `📌Đã thêm: ${getShort.sI}.`,
                    event.threadID,
                    event.messageID
                  );
                }
              } else {
                dataThread.push({
                  threadID: event.threadID,
                  autorep: [
                    {
                      type: "voice",
                      sI: getShort.sI,
                      sO: getShort.sO,
                      path: `src/auto_chat/other_data/${event.threadID}/${nameFile}`,
                    },
                  ],
                });
                writeFileSync(
                  resolve(__dirname, "src", "auto_chat", "data.json"),
                  JSON.stringify(dataThread, null, 4)
                );
                return api.sendMessage(
                  `📌Đã thêm: ${getShort.sI}.`,
                  event.threadID,
                  event.messageID
                );
              }
            } else
              return api.sendMessage(
                getShort.message,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Bạn phải reply 1 voice nào đó`,
              event.threadID,
              event.messageID
            );
        case "check":
          if (dataThread.some((item) => item.threadID == event.threadID)) {
            const getAll = dataThread.find(
              (item) => item.threadID == event.threadID
            );
            let num = 1,
              mgs = "";
            if (getAll.autorep.length > 0) {
              for (const item of getAll.autorep) {
                const type =
                  item.type == "text"
                    ? "1 text đính kèm"
                    : item.type == "sticker"
                    ? "và 1 sticker"
                    : item.type == "icon"
                    ? "và 1 icon"
                    : item.type == "gif"
                    ? "và 1 tệp GIF đính kèm"
                    : item.type == "video"
                    ? "và 1 tệp video đính kèm"
                    : item.type == "voice"
                    ? "và 1 tệp voice đính kèm"
                    : item.type == "image"
                    ? `và ${
                        Array.isArray(item.path) ? item.path.length : "1"
                      } tệp ảnh đính kèm`
                    : "";
                mgs += `${num++}/ ${item.sI} -> ${
                  item.sO
                } ${type}\n──────────────\n`;
              }
              return api.sendMessage(
                mgs + `\n📌reply số thứ tự để del`,
                event.threadID,
                async function (err, info) {
                  global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: String(event.senderID),
                    data: getAll.autorep,
                  });
                },
                event.messageID
              );
            } else
              return api.sendMessage(
                `📌Hiện tại chưa có auto rep nào!`,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Hiện tại chưa có auto rep nào!`,
              event.threadID,
              event.messageID
            );
        case "del":
          if (dataThread.some((item) => item.threadID == event.threadID)) {
            const getAll = dataThread.find(
              (item) => item.threadID == event.threadID
            );
            const contten = args.slice(1).join(" ");
            if (getAll.autorep.some((item) => item.sI == contten)) {
              let getAutoRep = getAll.autorep.find(
                (item) => item.sI == contten
              );
              let index = getAll.autorep.findIndex(
                (item) => item.sI == contten
              );
              if (
                ["gif", "image", "video", "voice"].includes(getAutoRep.type)
              ) {
                if (Array.isArray(getAutoRep.path)) {
                  for (const path of getAutoRep.path) {
                    unlinkSync(__dirname + `/${path}`);
                  }
                } else {
                  unlinkSync(__dirname + `/${getAutoRep.path}`);
                }
              }
              getAll.autorep.splice(index, 1);
              writeFileSync(
                resolve(__dirname, "src", "auto_chat", "data.json"),
                JSON.stringify(dataThread, null, 4)
              );
              return api.sendMessage(
                `📌xóa thành công auto rep: ${contten}.`,
                event.threadID,
                event.messageID
              );
            } else
              return api.sendMessage(
                `📌auto rep này k tồn tại`,
                event.threadID,
                event.messageID
              );
          } else
            return api.sendMessage(
              `📌Hiện tại chưa có auto rep nào!`,
              event.threadID,
              event.messageID
            );
        default:
          return api.sendMessage(
            `[🌸]─Cách Sử Dụng─[🌸]\n──────────────\n» autorep img xx -> xx\n 📌(reply ảnh)\n──────────────\n » autorep video xx -> xx\n 📌(reply video)\n──────────────\n » autorep gif xx -> xx\n 📌(reply gif)\n──────────────\n » autorep voice xx -> xx\n 📌(reply voice)\n──────────────\n » autorep icon xx -> xx\n 📌(reply icon)\n──────────────\n » autorep sticker xx -> xx\n 📌(reply sticker)\n──────────────\n » autorep text xx -> xx\n 📌(không cần reply)\n────────────────\n » autorep check\n 📌(xem danh sách)\n──────────────\n » autorep del xx\n 📌(để xóa)\n──────────────\n[🌸] ───────── [🌸]`,
            event.threadID
          );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.handleEvent = async ({ event, api }) => {
  if (!existsSync(join(__dirname, "src", "auto_chat"))) {
    mkdirSync(join(__dirname, "src", "auto_chat", "other_data"), {
      recursive: true,
    });
  } else if (!existsSync(join(__dirname, "src", "auto_chat", "data.json"))) {
    writeFileSync(resolve(__dirname, "src", "auto_chat", "data.json"), "[]");
  } else {
    const dataThread = JSON.parse(
      readFileSync(join(__dirname, "src", "auto_chat", "data.json"), "utf8")
    );
    if (dataThread.some((item) => item.threadID == event.threadID)) {
      const threadShort = dataThread.find(
        (item) => item.threadID == event.threadID
      );
      const getShort = threadShort.autorep.find(
        (item) => item.sI == event.body);
      if (getShort) {
        switch (getShort.type) {
          case "text":
            return api.sendMessage(getShort.sO, event.threadID);
          case "icon":
            return api.sendMessage(
              getShort.sO,
              event.threadID,
              async (err, info) => {
                return api.sendMessage(getShort.icon, info.threadID);
              }
            );
          case "sticker":
            return api.sendMessage(
              getShort.sO,
              event.threadID,
              async (err, info) => {
                api.sendMessage({ sticker: getShort.sticker }, info.threadID);
              }
            );
          case "gif":
            return api.sendMessage(
              getShort.sO,
              event.threadID,
              async (err, info) => {
                return api.sendMessage(
                  {
                    attachment: createReadStream(
                      __dirname + `/${getShort.path}`
                    ),
                  },
                  info.threadID
                );
              }
            );
          case "video":
            return api.sendMessage(
              {
                body: getShort.sO,
                attachment: createReadStream(__dirname + `/${getShort.path}`),
              },
              event.threadID
            );
          case "voice":
            return api.sendMessage(
              {
                body: getShort.sO,
                attachment: createReadStream(__dirname + `/${getShort.path}`),
              },
              event.threadID
            );
          case "image":
            if (Array.isArray(getShort.path)) {
              let folderPath = [];
              for (const data of getShort.path) {
                folderPath.push(createReadStream(__dirname + `/${data}`));
              }
              return api.sendMessage(
                { body: getShort.sO, attachment: folderPath },
                event.threadID
              );
            } else {
              return api.sendMessage(
                {
                  body: getShort.sO,
                  attachment: createReadStream(__dirname + `/${getShort.path}`),
                },
                event.threadID
              );
            }

          default:
            return;
        }
      } else return;
    } else return;
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const body = event.body.split(" ");
  api.unsendMessage(handleReply.messageID);
  const dataThread = JSON.parse(
    readFileSync(join(__dirname, "src", "auto_chat", "data.json"), "utf8")
  );
  if (body.length > 1) {
    const getAll = dataThread.find((item) => item.threadID == event.threadID);
    for (const num of body) {
      let getAutoRep = getAll.autorep.find(
        (item) => item.sI == handleReply.data[num - 1].sI
      );
      let index = getAll.autorep.findIndex(
        (item) => item.sI == handleReply.data[num - 1].sI
      );
      if (["gif", "image", "video", "voice"].includes(getAutoRep.type)) {
        if (Array.isArray(getAutoRep.path)) {
          for (const path of getAutoRep.path) {
            unlinkSync(__dirname + `/${path}`);
          }
        } else {
          unlinkSync(__dirname + `/${getAutoRep.path}`);
        }
      }
      getAll.autorep.splice(index, 1);
      writeFileSync(
        resolve(__dirname, "src", "auto_chat", "data.json"),
        JSON.stringify(dataThread, null, 4)
      );
    }
    return api.sendMessage(
      `📌xóa thành công ${body.length} auto rep.`,
      event.threadID,
      event.messageID
    );
  } else {
    if (handleReply.data.length > parseInt(body[0] - 1)) {
      const getAll = dataThread.find((item) => item.threadID == event.threadID);
      let getAutoRep = getAll.autorep.find(
        (item) => item.sI == handleReply.data[body[0] - 1].sI
      );
      let index = getAll.autorep.findIndex(
        (item) => item.sI == handleReply.data[body[0] - 1].sI
      );
      if (["gif", "image", "video", "voice"].includes(getAutoRep.type)) {
        if (Array.isArray(getAutoRep.path)) {
          for (const path of getAutoRep.path) {
            unlinkSync(__dirname + `/${path}`);
          }
        } else {
          unlinkSync(__dirname + `/${getAutoRep.path}`);
        }
      }
      getAll.autorep.splice(index, 1);
      writeFileSync(
        resolve(__dirname, "src", "auto_chat", "data.json"),
        JSON.stringify(dataThread, null, 4)
      );
      return api.sendMessage(
        `📌xóa thành công auto rep: ${handleReply.data[body[0] - 1].sI}.`,
        event.threadID,
        event.messageID
      );
    } else
      return api.sendMessage(
        `📌yêu cầu không hợp lệ!`,
        event.threadID,
        event.messageID
      );
  }
};
