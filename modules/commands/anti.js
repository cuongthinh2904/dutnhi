module.exports.config = {
    name: "anti",
    version: "4.1.5",
    hasPermssion: 1,
    credits: "DEV NDK",
    description: "ANTI BOX",
    commandCategory: "Qtv",
    usages: "anti dùng để bật tắt",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
    },
};

const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join, resolve } = require("path");
const axios = require("axios");

module.exports.handleEvent = async function ({ event }) {
    if (!existsSync(join(__dirname, "src", "anti_data.json"))) {
        writeFileSync(resolve(__dirname, "src", "anti_data.json"), "[]");
    } else {
        const dataThread = JSON.parse(
            readFileSync(join(__dirname, "src", "anti_data.json"), "utf8")
        );
        if (!dataThread.some((i) => i.threadID === event.threadID)) {
            dataThread.push({
                threadID: event.threadID,
                namebox: { status: false, name: "" },
                avtbox: { status: false, url: "" },
                bd: { status: false, nicknames: {} },
                out: false,
                qtvOnly: false,
                adminOnly: false,
                category: []
            });
            writeFileSync(
                resolve(__dirname, "src", "anti_data.json"),
                JSON.stringify(dataThread, null, 4)
            );
        }
    }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const { senderID, threadID, messageID } = event;
    const { author, permssion, type } = handleReply;
    if (author !== senderID)
        return api.sendMessage(`Bạn không người dùng lệnh!`, threadID);
    const dataThread = JSON.parse(
        readFileSync(join(__dirname, "src", "anti_data.json"), "utf8")
    );
    const { namebox, avtbox, bd, category } = dataThread.find(
        (item) => item.threadID === threadID
    );
    switch (type) {
        case "choose":
            var number = event.args.filter((i) => !isNaN(i));
            for (const num of number) {
                switch (num) {
                    case "1": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE ANTI NAMEBOX <---//
                        if (permssion < 1)
                            return api.sendMessage(
                                "BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
                                threadID,
                                messageID
                            );
                        namebox.status = !namebox.status;
                        if (namebox.status) {
                            var { threadName } = await api.getThreadInfo(
                                event.threadID
                            );

                            if (!threadName)
                                return api.sendMessage(
                                    "Vui lòng đặt tên cho nhóm!",
                                    threadID,
                                    messageID
                                );
                            namebox.name = threadName;
                            api.sendMessage(
                                "✅ Bật thành công chế độ ANTI đổi tên box",
                                threadID,
                                messageID
                            );
                        } else {
                            namebox.name = "";
                            api.sendMessage(
                                "✅ Tắt thành công chế độ ANTI đổi tên box ",
                                threadID,
                                messageID
                            );
                        }
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    }
                    case "2": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE ANTI AVTBOX <---//
                        if (permssion < 1)
                            return api.sendMessage(
                                "BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
                                threadID,
                                messageID
                            );
                        avtbox.status = !avtbox.status;
                        if (avtbox.status) {
                            var { imageSrc } = await api.getThreadInfo(
                                event.threadID
                            );
                            if (!imageSrc)
                                return api.sendMessage(
                                    "Vui lòng đặt avt cho nhóm!",
                                    threadID,
                                    messageID
                                );
                            const { data: res } = await axios({
                                method: "POST",
                                url: "https://api.imgur.com/3/image",
                                headers: {
                                    Authorization: "Client-ID fc9369e9aea767c",
                                },
                                data: {
                                    image: imageSrc,
                                },
                            });
                            avtbox.url = res.data.link;
                            api.sendMessage(
                                "✅ Bật thành công chế độ ANTI đổi ảnh box",
                                threadID,
                                messageID
                            );
                        } else {
                            avtbox.url = "";
                            api.sendMessage(
                                "✅ Tắt thành công chế độ ANTI đổi ảnh box",
                                threadID,
                                messageID
                            );
                        }
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    }
                    case "3": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE ANTI BD <---//
                        if (permssion < 1)
                            return api.sendMessage(
                                " BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
                                threadID,
                                messageID
                            );
                        bd.status = !bd.status;
                        if (bd.status) {
                            const { nicknames } = await api.getThreadInfo(
                                event.threadID
                            );
                            bd.nicknames = nicknames;
                            api.sendMessage(
                                "✅ Bật thành công chế độ ANTI đổi biệt danh",
                                threadID,
                                messageID
                            );
                        } else {
                            bd.nicknames = {};
                            api.sendMessage(
                                "✅ Tắt thành công chế độ ANTI đổi biệt danh ",
                                threadID,
                                messageID
                            );
                        }
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    }
                    case "4": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE ANTI OUT<---//
                        if (permssion < 1)
                            return api.sendMessage(
                                " BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
                                threadID,
                                messageID
                            );
                        const anti_out = dataThread.find(
                            (item) => item.threadID === threadID
                        );
                        anti_out.out = !anti_out.out;

                        api.sendMessage(
                            `✅ ${
                                anti_out.out ? "bật" : "tắt"
                            } thành công chế độ ANTI out!`,

                            threadID,
                            messageID
                        );

                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    }
                    case "5": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE QTV ONLY<---//
                        if (permssion < 1)
                            return api.sendMessage(
                                "𝗠𝗢𝗗𝗘 - Quyền nồn biên giới ",
                                threadID,
                                messageID
                            );
                        const qtv_Only = dataThread.find(
                            (item) => item.threadID === threadID
                        );
                        qtv_Only.qtvOnly = !qtv_Only.qtvOnly;
                        if (qtv_Only.qtvOnly) {
                            api.sendMessage(
                                "𝗠𝗢𝗗𝗘 - Kích hoạt thành công chế độ Quản trị viên, chỉ Quản trị viên có thể sử dụng Bot",
                                threadID,
                                messageID
                            );
                        } else {
                            api.sendMessage(
                                "𝗠𝗢𝗗𝗘 - Tắt thành công chế độ Quản trị viên, tất cả thành viên có thể sử dụng Bot",
                                threadID,
                                messageID
                            );
                        }
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    }
                    case "6": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE ADMIN ONLY<---//
                        if (permssion < 2)
                            return api.sendMessage(
                                "⚡️ nịt nek lấy ko",
                                threadID,
                                messageID
                            );
                        const admin_Only = dataThread.find(
                            (item) => item.threadID === threadID
                        );
                        admin_Only.adminOnly = !admin_Only.adminOnly;
                        if (admin_Only.adminOnly) {
                            api.sendMessage(
                                "✅ Bật thành công chế độ chỉ ADMIN có thể dùng bot",
                                threadID,
                                messageID
                            );
                        } else {
                            api.sendMessage(
                                "✅ Tắt thành công chế độ chỉ ADMIN có thể dùng bot ",
                                threadID,
                                messageID
                            );
                        }
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    }
                    case "7": {
                        api.unsendMessage(handleReply.messageID);
                        //---> CODE category ONLY<---//
                        if (permssion < 1)
                            return api.sendMessage(
                                " BẠN CHƯA ĐỦ TUỔI ĐỂ DÙNG LỆNH NÀY!",
                                threadID,
                                messageID
                            );
                        const { commands } = global.client;
                        let list_category = [],
                            mgs = "";
                        for (const item of commands.values()) {
                            if (
                                list_category.some(
                                    (i) => i === item.config.commandCategory
                                )
                            )
                                continue;
                            else
                                list_category.push(item.config.commandCategory);
                        }
                        list_category.forEach((item, index) => {
                            mgs += `${index + 1}/ ${item} (${
                                category.includes(item) ? "ON" : "OFF"
                            })\n`;
                        });
                        return api.sendMessage(
                            `${mgs}\nreply stt + [on/off]`,
                            threadID,
                            async function (err, info) {
                                global.client.handleReply.push({
                                    name: module.exports.config.name,
                                    messageID: info.messageID,
                                    author: senderID,
                                    permssion,
                                    list_category,
                                    type: "category",
                                });
                            }
                        );
                    }
                    
                    default: {
                        return api.sendMessage(
                            `Số bạn chọn không có trong anti!`,
                            threadID
                        );
                    }
                }
            }
            break;
        case "category":
            let body = event.body.split(" ");
            let type = body.pop();
            if (!["on", "off"].includes(type))
                return api.sendMessage(
                    "Vui lòng nhập type (on/off)!",
                    event.threadID,
                    event.messageID
                );
            if (body.length > 1) {
                api.unsendMessage(handleReply.messageID);
                switch (type) {
                    case "on":
                        let mgs = "",
                            num = 1;
                        for (const item of body) {
                            const getNameCategory =
                                handleReply.list_category[item - 1];
                            if (category.includes(getNameCategory)) continue;
                            mgs += `${num++}/ ${getNameCategory} (ON)\n`;
                            category.push(getNameCategory);
                            writeFileSync(
                                resolve(__dirname, "src", "anti_data.json"),
                                JSON.stringify(dataThread, null, 4)
                            );
                        }
                        return api.sendMessage(
                            `Kết quả:\n${mgs}`,
                            event.threadID
                        );
                    case "off":
                        let mgsd = "",
                            numd = 1;
                        for (const item of body) {
                            const getNameCategory =
                                handleReply.list_category[item - 1];
                            if (!category.includes(getNameCategory)) continue;
                            mgsd += `${numd++}/ ${getNameCategory} (OFF)\n`;
                            const index_ = category.findIndex(
                                (i) => i === getNameCategory
                            );
                            category.splice(index_, 1);
                            writeFileSync(
                                resolve(__dirname, "src", "anti_data.json"),
                                JSON.stringify(dataThread, null, 4)
                            );
                        }
                        return api.sendMessage(
                            `Kết quả:\n${mgsd}`,
                            event.threadID
                        );
                }
            } else {
                const getNameCategory = handleReply.list_category[body[0] - 1];
                api.unsendMessage(handleReply.messageID);
                switch (type) {
                    case "on":
                        if (category.includes(getNameCategory))
                            return api.sendMessage(
                                `𝗠𝗢𝗗𝗘 - anti quyền hạn: ${getNameCategory} đã bật`,
                                threadID,
                                messageID
                            );
                        category.push(getNameCategory);
                        api.sendMessage(
                            `𝗠𝗢𝗗𝗘 - bật thành công anti quyền hạn: ${getNameCategory}`,
                            threadID,
                            messageID
                        );
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                    case "off":
                        if (!category.includes(getNameCategory))
                            return api.sendMessage(
                                `𝗠𝗢𝗗𝗘 - anti quyền hạn: ${getNameCategory} chưa bật`,
                                threadID,
                                messageID
                            );
                        const index_ = category.findIndex(
                            (i) => i === getNameCategory
                        );
                        category.splice(index_, 1);
                        api.sendMessage(
                            `𝗠𝗢𝗗𝗘 - tắt thành công anti quyền hạn: ${getNameCategory}`,
                            threadID,
                            messageID
                        );
                        return writeFileSync(
                            resolve(__dirname, "src", "anti_data.json"),
                            JSON.stringify(dataThread, null, 4)
                        );
                }
            }
            break;
    }
};

module.exports.run = async ({ api, event, permssion }) => {
    const { threadID, senderID } = event;
    const dataThread = JSON.parse(
        readFileSync(join(__dirname, "src", "anti_data.json"), "utf8")
    );
    const {
        namebox,
        avtbox,
        bd,
        out,
        qtvOnly,
        adminOnly,
        category,
    } = dataThread.find((item) => item.threadID === threadID);

    return api.sendMessage(
        ` ==== 『Anti 』 ====\n` +
            `┏━━━━━━━━━━━━━┓\n` +
            `┣➤1.Anti namebox : cấm đổi tên nhóm (${
                namebox.status ? "ON" : "OFF"
            })\n` +
            `┣➤2.Anti avtbox : cấm đổi ảnh nhóm (${
                avtbox.status ? "ON" : "OFF"
            })\n` +
            `┣➤3.Anti bd : cấm đổi biệt danh (${bd.status ? "ON" : "OFF"})\n` +
            `┣➤4.Anti out: cấm out chùa (${out ? "ON" : "OFF"})\n` +
            `┣➤5 anti thành viên : cấm thành viên sài bot (${
                qtvOnly ? "ON" : "OFF"
            })\n` +
            `┣➤6 anti box : cấm tất cả sài bot kể cả qtv (${
                adminOnly ? "ON" : "OFF"
            })\n` +
            `┣➤7 anti quyền hạn : cấm thành viên sài các quyền hạn (${
                category.length > 0 ? "ON" : "OFF"
            })\n` +
            `┗━━━━━━━━━━━━━┛`,
        threadID,
        (error, info) => {
            if (error) {
                return api.sendMessage("Đã xảy ra lỗi!", threadID);
            } else {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    permssion,
                    type: "choose",
                });
            }
        }
    );
};
