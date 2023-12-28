const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs-extra");
const qs = require("qs");
const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});
module.exports.config = {
    name: "setlq",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "DEV NDK",
    description: "setlq",
    commandCategory: "Game",
    usages: "setlq",
    cooldowns: 5,
};

module.exports.run = async function ({ event, Users, message, args, api }) {
    try {
        const { userID, name } = await Users.getData(event.senderID);
        const newName = name.split(" ");
        const { data } = await axios({
            method: "POST",
            url: "https://dev-ndk.id.vn/api/v1/setlq/getdata",
            data: {
                uid: userID,
                name: newName[newName.length - 1],
            },
        });
        switch (args[0]) {
            case "check":
                return axios({
                    method: "POST",
                    url: "https://dev-ndk.id.vn/api/v1/setlq/check",
                    data: {
                        uid: userID,
                        name: newName[newName.length - 1],
                    },
                    responseType: "arraybuffer",
                }).then(function ({ data: img }) {
                    const path =
                        __dirname +
                        `/src/${new Date().getTime()}_${event.senderID}.png`;
                    fs.writeFileSync(path, Buffer.from(img, "utf-8"));
                    return api.sendMessage(
                        {
                            body: "bla bla",
                            attachment: fs.createReadStream(path),
                        },
                        event.threadID
                    );
                });
            case "info":
                if (Object.keys(event.mentions)[0]) {
                    if (
                        data.list_setlq.some(
                            (item) =>
                                item.uid ===
                                String(Object.keys(event.mentions)[0])
                        )
                    ) {
                        const data_get = data.list_setlq.find(
                            (item) =>
                                item.uid ===
                                String(Object.keys(event.mentions)[0])
                        );
                        return axios({
                            method: "POST",
                            url: `https://dev-ndk.id.vn/api/v1/setlq/setlq_card`,
                            data: qs.stringify({
                                type: data_get.type,
                                than_mat: data_get.than_mat,
                                lv_than_mat: data_get.lv_than_mat,
                                so_ngay: day(moment(data_get.days)),
                                nam: data_get.yyyy,
                                ngay_thang: data_get.mm_dd,
                                name_1: data.name,
                                name_2: data_get.name,
                                uid_1: data.uid,
                                uid_2: data_get.uid,
                            }),
                            responseType: "arraybuffer",
                        }).then(async function ({ data: dataImg }) {
                            const path =
                                __dirname +
                                `/src/${new Date().getTime()}_${
                                    event.senderID
                                }.png`;
                            fs.writeFileSync(
                                path,
                                Buffer.from(dataImg, "utf-8")
                            );
                            return api.sendMessage(
                                {
                                    body: "bla bla",
                                    attachment: fs.createReadStream(path),
                                },
                                event.threadID,
                                () => fs.unlinkSync(path)
                            );
                        });
                    } else
                        return api.sendMessage(
                            `Bạn chưa set với người này`,
                            event.threadID
                        );
                } else if (event.type == "message_reply") {
                    if (event.senderID === event.messageReply.senderID)
                        return api.sendMessage(
                            `bạn không thể kiểm tra info chính mình`,
                            event.threadID
                        );
                    if (
                        data.list_setlq.some(
                            (item) =>
                                item.uid === String(event.messageReply.senderID)
                        )
                    ) {
                        const data_get = data.list_setlq.find(
                            (item) =>
                                item.uid === String(event.messageReply.senderID)
                        );
                        return axios({
                            method: "POST",
                            url: `https://dev-ndk.id.vn/api/v1/setlq/setlq_card`,
                            data: qs.stringify({
                                type: data_get.type,
                                than_mat: data_get.than_mat,
                                lv_than_mat: data_get.lv_than_mat,
                                so_ngay: day(moment(data_get.days)),
                                nam: data_get.yyyy,
                                ngay_thang: data_get.mm_dd,
                                name_1: data.name,
                                name_2: data_get.name,
                                uid_1: data.uid,
                                uid_2: data_get.uid,
                            }),
                            responseType: "arraybuffer",
                        }).then(async function ({ data: dataImg }) {
                            const path =
                                __dirname +
                                `/src/${new Date().getTime()}_${
                                    event.senderID
                                }.png`;
                            fs.writeFileSync(
                                path,
                                Buffer.from(dataImg, "utf-8")
                            );
                            return api.sendMessage(
                                {
                                    body: "bla bla",
                                    attachment: fs.createReadStream(path),
                                },
                                event.threadID,
                                () => fs.unlinkSync(path)
                            );
                        });
                    } else
                        return api.sendMessage(
                            `Bạn chưa set với người này`,
                            event.threadID
                        );
                } else {
                    return api.sendMessage(
                        `bạn cần tag/reply người bạn muốn xem info!`,
                        event.threadID
                    );
                }
            case "del":
                const body = `1/ Love\n2/ anh em\n3/ chị em\n4/ bạn bè`;
                return api.sendMessage(
                    body,
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "del",
                            data: {
                                type: ["setlove", "setae", "setce", "setbb"],
                            },
                        });
                    },
                    event.messageID
                );
            case "shop":
                let number = 1,
                    mess = "";

                for (const i of data.item) {
                    mess += `┣➤${number++}/ ${i.type} ${VND.format(i.buy)}\n`;
                }
                const body_ = `====[SHOP HOA]====\n┏━━━━━━━━━━━━━┓\n${mess}┗━━━━━━━━━━━━━┛\n┏━━━━━━━━━━━━━┓\n┣➤ reply stt để mua vật phẩm\n┣➤ lần sau ủng hộ tiếp nhé\n┗━━━━━━━━━━━━━┛`;
                return api.sendMessage(
                    body_,
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "shop",
                            data: data.item,
                        });
                    },
                    event.messageID
                );
            case "tang":
                const body__ = `chọn kiểu bạn muốn tặng:\n1/ Love\n2/ Anh em\n3/ Chị em\n4/ Bạn bè`;
                return api.sendMessage(
                    body__,
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "tang",
                            data: ["setlove", "setae", "setce", "setbb"],
                        });
                    },
                    event.messageID
                );
            default:
                if (Object.keys(event.mentions)[0]) {
                    const { userID: userID_2, name: name_2 } =
                        await Users.getData(Object.keys(event.mentions)[0]);
                    if (
                        !data.list_setlq.some(
                            (item) =>
                                item.uid ===
                                String(Object.keys(event.mentions)[0])
                        )
                    ) {
                        const newName_2 = name_2.split(" ");
                        await axios({
                            method: "POST",
                            url: "https://dev-ndk.id.vn/api/v1/setlq/getdata",
                            data: {
                                uid: userID_2,
                                name: newName_2[newName_2.length - 1],
                            },
                        });
                        const body = `chọn kiểu bạn muốn set:\n1/ set Love\n2/ set anh em\n3/ set chị em\n4/ set bạn bè`;
                        return api.sendMessage(
                            body,
                            event.threadID,
                            (err, info) => {
                                global.client.handleReply.push({
                                    name: this.config.name,
                                    messageID: info.messageID,
                                    author: event.senderID,
                                    type: "setlq",
                                    data: {
                                        type: [
                                            "setlove",
                                            "setae",
                                            "setce",
                                            "setbb",
                                        ],
                                        uid_1: userID,
                                        uid_2: userID_2,
                                    },
                                });
                            },
                            event.messageID
                        );
                    } else
                        return api.sendMessage(
                            `Bạn đã set với ${name_2} trước đó!`,
                            event.threadID
                        );
                } else if (event.type == "message_reply") {
                    if (event.senderID === event.messageReply.senderID)
                        return api.sendMessage(
                            `bạn không thể tự set chính bạn!`,
                            event.threadID
                        );
                    const { userID: userID_2, name: name_2 } =
                        await Users.getData(event.messageReply.senderID);
                    if (
                        !data.list_setlq.some(
                            (item) =>
                                item.uid === String(event.messageReply.senderID)
                        )
                    ) {
                        const newName_2 = name_2.split(" ");
                        await axios({
                            method: "POST",
                            url: "https://dev-ndk.id.vn/api/v1/setlq/getdata",
                            data: {
                                uid: userID_2,
                                name: newName_2[newName_2.length - 1],
                            },
                        });
                        const body = `chọn kiểu bạn muốn set:\n1/ set Love\n2/ set anh em\n3/ set chị em\n4/ set bạn bè`;
                        return api.sendMessage(
                            body,
                            event.threadID,
                            (err, info) => {
                                global.client.handleReply.push({
                                    name: this.config.name,
                                    messageID: info.messageID,
                                    author: event.senderID,
                                    type: "setlq",
                                    data: {
                                        type: [
                                            "setlove",
                                            "setae",
                                            "setce",
                                            "setbb",
                                        ],
                                        uid_1: userID,
                                        uid_2: userID_2,
                                    },
                                });
                            },
                            event.messageID
                        );
                    } else
                        return api.sendMessage(
                            `Bạn đã set với ${name_2} trước đó!`,
                            event.threadID
                        );
                } else {
                    return api.sendMessage(
                        `setlq tag ( tag người bạn muốn set )\n` +
                            `setlq check ( check xem bạn đang có những set hiện tại )\n` +
                            `setlq info ( xem thông tin set hiện tại )\n` +
                            `setlq del ( xoá set hiện tại )\n` +
                            `setlq shop ( mua hoa tặng cho set bạn muốn )\n` +
                            `setlq tặng ( xem bạn có những loại hoa j và số lượng bao nhiêu và tặng cho ai )`,
                        event.threadID
                    );
                }
        }
    } catch (error) {}
};

module.exports.handleReply = async function ({
    args,
    event,
    api,
    handleReply,
    Users,
    Currencies,
}) {
    const { author } = handleReply;
    if (event.senderID !== author)
        return api.sendMessage(
            "Bạn không phải người dùng lệnh này!",
            event.threadID,
            event.messageID
        );
    const { userID, name: name_1 } = await Users.getData(event.senderID);
    const { money } = await Currencies.getData(event.senderID);
    const newName = name_1.split(" ");
    const { data } = await axios({
        method: "POST",
        url: "https://dev-ndk.id.vn/api/v1/setlq/getdata",
        data: {
            uid: userID,
            name: newName[newName.length - 1],
        },
    });
    switch (handleReply.type) {
        case "setlq":
            const type = handleReply.data.type[event.body - 1];
            const get_set = data.list_setlq.filter(
                (item) => item.type === type
            );
            if (get_set.length === (type === "setlove" ? 1 : 5)) {
                return api.sendMessage(
                    `Bạn đã đạt tối đa số lần set ${
                        type === "setlove"
                            ? "love"
                            : type === "setae"
                            ? "anh em"
                            : type === "setce"
                            ? "chị em"
                            : type === "setbb"
                            ? "bạn bè"
                            : ""
                    } (${get_set.length}/${type === "setlove" ? 1 : 5})`,
                    event.threadID,
                    event.messageID
                );
            } else {
                api.unsendMessage(handleReply.messageID);
                const { name: name_2, userID: userID_2 } = await Users.getData(
                    handleReply.data.uid_2
                );
                const newName_2 = name_2.split(" ");
                const { data: data_2 } = await axios({
                    method: "POST",
                    url: "https://dev-ndk.id.vn/api/v1/setlq/getdata",
                    data: {
                        uid: userID_2,
                        name: newName_2[newName_2.length - 1],
                    },
                });
                const get_set_2 = data_2.list_setlq.filter(
                    (item) => item.type === type
                );
                if (get_set_2.length === (type === "setlove" ? 1 : 5))
                    return api.sendMessage(
                        `${
                            (await Users.getData(handleReply.data.uid_2)).name
                        } đã đạt tối đa số lần set ${
                            type === "setlove"
                                ? "love"
                                : type === "setae"
                                ? "anh em"
                                : type === "setce"
                                ? "chị em"
                                : type === "setbb"
                                ? "bạn bè"
                                : ""
                        } (${get_set_2.length}/${type === "setlove" ? 1 : 5})`,
                        event.threadID,
                        event.messageID
                    );
                const body = `2 bạn có muốn set ${
                    type === "setlove"
                        ? "love"
                        : type === "setae"
                        ? "anh em"
                        : type === "setce"
                        ? "chị em"
                        : type === "setbb"
                        ? "bạn bè"
                        : ""
                } với nhau không\nNếu muốn:\nThả: ❤️\nThả icon bất kỳ để từ chối\nGửi đến: ${
                    (await Users.getData(handleReply.data.uid_2)).name
                }`;
                return api.sendMessage(
                    {
                        body,
                        mentions: [
                            {
                                id: handleReply.data.uid_2,
                                tag: (
                                    await Users.getData(handleReply.data.uid_2)
                                ).name,
                            },
                        ],
                    },
                    event.threadID,
                    (err, info) => {
                        global.client.handleReaction.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: handleReply.data.uid_2,
                            type: "setlq",
                            data: {
                                type,
                                uid_1: handleReply.data.uid_1,
                                uid_2: handleReply.data.uid_2,
                            },
                        });
                    },
                    event.messageID
                );
            }
            break;
        case "del":
            const type_ = handleReply.data.type[event.body - 1];
            const get_set_ = data.list_setlq.filter(
                (item) => item.type === type_
            );
            if (get_set_.length > 0) {
                let num = 1,
                    mss = "";
                for (const item of get_set_) {
                    mss += `${num++}/ ${
                        (await Users.getData(item.uid)).name
                    }\n`;
                }
                return api.sendMessage(
                    `${mss}\nreply stt để hủy set`,
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "replydel",
                            data: get_set_,
                        });
                    },
                    event.messageID
                );
            } else
                return api.sendMessage(
                    `hiện bạn chưa có set ${
                        type_ === "setlove"
                            ? "love"
                            : type_ === "setae"
                            ? "anh em"
                            : type_ === "setce"
                            ? "chị em"
                            : type_ === "setbb"
                            ? "bạn bè"
                            : ""
                    } nào!`,
                    event.threadID
                );
            break;
        case "replydel":
            api.unsendMessage(handleReply.messageID);
            const get_uid_del = handleReply.data[event.body - 1];
            return axios({
                method: "POST",
                url: "https://dev-ndk.id.vn/api/v1/setlq/delset",
                data: {
                    uid: event.senderID,
                    uid_del: get_uid_del.uid,
                },
            }).then(function ({ data: res }) {
                if (res.status) {
                    api.sendMessage(
                        `hủy set ${
                            get_uid_del.type === "setlove"
                                ? "love"
                                : get_uid_del.type === "setae"
                                ? "anh em"
                                : get_uid_del.type === "setce"
                                ? "chị em"
                                : get_uid_del.type === "setbb"
                                ? "bạn bè"
                                : ""
                        } thành công!`,
                        event.threadID
                    );
                } else return api.sendMessage(`hủy set thất bại!`, event.threadID);
            });
        case "shop":
            api.unsendMessage(handleReply.messageID);
            const get_item_shop = handleReply.data[event.body - 1];
            const path =
                __dirname +
                `/src/${new Date().getTime()}_${event.senderID}.png`;
            await global.utils.downloadFile(get_item_shop.url, path);
            return api.sendMessage(
                {
                    body: `${get_item_shop.type}\nThân mật: ${
                        get_item_shop.thanmat
                    }\nGiá: ${VND.format(
                        get_item_shop.buy
                    )}\nSố tiền bạn đang có: ${VND.format(
                        money
                    )}\nReply nhập số lượng muốn mua`,
                    attachment: fs.createReadStream(path),
                },
                event.threadID,
                (err, info) => {
                    fs.unlinkSync(path);
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "buy",
                        data: get_item_shop,
                    });
                },
                event.messageID
            );
        case "buy":
            if (isNaN(event.body))
                return api.sendMessage(
                    "số lượng phải là con số! ",
                    event.threadID
                );
            const money_buy = handleReply.data.buy * event.body;
            if (money_buy > money)
                return api.sendMessage(
                    "số tiền của bạn không đủ để giao dịch!",
                    event.threadID
                );
            api.unsendMessage(handleReply.messageID);
            await Currencies.decreaseMoney(event.senderID, money_buy);
            return axios({
                method: "POST",
                url: "https://dev-ndk.id.vn/api/v1/setlq/additem",
                data: {
                    uid: event.senderID,
                    soluong: parseInt(event.body),
                    item: handleReply.data.type,
                },
            }).then(function ({ data: ress }) {
                api.unsendMessage(handleReply.messageID);
                if (ress.status) {
                    return api.sendMessage(
                        "Giao dịch thành công!\nSố tiền đã chi: " +
                            VND.format(money_buy) +
                            "\nSố dư: " +
                            VND.format(money - money_buy),
                        event.threadID
                    );
                }
            });
        case "tang":
            const get_type_ = handleReply.data[event.body - 1];
            const get_list = data.list_setlq.filter(
                (i) => i.type === get_type_
            );
            if (get_list.length > 0) {
                let num_S = 1,
                    mass = "";
                for (const u of get_list) {
                    mass += `${num_S++}/ ${
                        (await Users.getData(u.uid)).name
                    }\nThân mật: ${u.than_mat}\n---------------------\n`;
                }
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(
                    `${mass}\nreply stt để chọn người muốn tặng`,
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "chon_item",
                            data: get_list,
                        });
                    },
                    event.messageID
                );
            } else {
                return api.sendMessage(
                    `Hiện bạn chưa có set ${
                        get_type_ === "setlove"
                            ? "love"
                            : get_type_ === "setae"
                            ? "anh em"
                            : get_type_ === "setce"
                            ? "chị em"
                            : get_type_ === "setbb"
                            ? "bạn bè"
                            : ""
                    } nào!`,
                    event.threadID,
                    event.messageID
                );
            }
        case "chon_item":
            const get_uuse = handleReply.data[event.body - 1];
            const get_item_usse = data.item.filter((i) => i.soluong > 0);
            if (get_item_usse.length > 0) {
                let num_S_ = 1,
                    mass_ = "";
                for (const u of get_item_usse) {
                    mass_ += `${num_S_++}/ ${u.type}\nHiện có: ${
                        u.soluong
                    }\nThân mật: ${u.thanmat} (${
                        parseInt(u.soluong) * parseInt(u.thanmat)
                    } điểm)\n---------------------\n`;
                }
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(
                    `Hiện tại bạn đang có:\n${mass_}\nReply stt + sô lượng mà bạn muốn tặng\n -> ví dụ 1x4`,
                    event.threadID,
                    (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "send_item",
                            data: {
                                items: get_item_usse,
                                user: get_uuse,
                            },
                        });
                    },
                    event.messageID
                );
            } else
                return api.sendMessage(
                    "Hiện bạn không có vật phẩm nào",
                    event.threadID
                );
        case "send_item":
            if (event.body.indexOf("x") !== -1) {
                const get_input = event.body.split("x");
                const input_1 = get_input[0].trim();
                const input_2 = get_input[1].trim();
                if (isNaN(input_1) || isNaN(input_2))
                    return api.sendMessage(
                        `${
                            isNaN(input_1)
                                ? "chọn vật phẩm phải là con số!"
                                : "số lượng phải là con số!"
                        }`,
                        event.threadID
                    );
                const get_item_send = handleReply.data.items[input_1 - 1];
                if (get_item_send) {
                    if (input_2 > get_item_send.soluong) {
                        return api.sendMessage(
                            "Số lượng vật phẩm không đc lớn hơn số lượng hiện có!",
                            event.threadID
                        );
                    } else {
                        api.unsendMessage(handleReply.messageID);
                        return axios({
                            method: "POST",
                            url: "https://dev-ndk.id.vn/api/v1/setlq/senditem",
                            data: {
                                uid: event.senderID,
                                type: get_item_send.type,
                                soluong: input_2,
                                uid_get: handleReply.data.user.uid,
                            },
                        }).then(async function ({ data: resa }) {
                            if (resa.status) {
                                const path =
                                    __dirname +
                                    `/src/${new Date().getTime()}_${
                                        event.senderID
                                    }.png`;
                                await global.utils.downloadFile(
                                    get_item_send.url,
                                    path
                                );
                                const level = Math.floor(
                                    Math.sqrt(
                                        1 +
                                            ((parseInt(
                                                handleReply.data.user.than_mat
                                            ) +
                                                parseInt(input_2) *
                                                    get_item_send.thanmat) *
                                                +1) /
                                                3 +
                                            1
                                    ) /
                                        5 +
                                        1
                                );
                                if (level > handleReply.data.user.lv_than_mat) {
                                    return axios({
                                        method: "POST",
                                        url: `https://dev-ndk.id.vn/api/v1/setlq/setlq_card`,
                                        data: qs.stringify({
                                            type: handleReply.data.user.type,
                                            than_mat:
                                                parseInt(
                                                    handleReply.data.user
                                                        .than_mat
                                                ) +
                                                parseInt(input_2) *
                                                    get_item_send.thanmat,
                                            lv_than_mat: level,
                                            so_ngay: day(
                                                moment(
                                                    handleReply.data.user.days
                                                )
                                            ),
                                            nam: handleReply.data.user.yyyy,
                                            ngay_thang:
                                                handleReply.data.user.mm_dd,
                                            name_1: data.name,
                                            name_2: handleReply.data.user.name,
                                            uid_1: data.uid,
                                            uid_2: handleReply.data.user.uid,
                                        }),
                                        responseType: "arraybuffer",
                                    }).then(async function ({ data: dataImg }) {
                                        const path =
                                            __dirname +
                                            `/src/${new Date().getTime()}_${
                                                event.senderID
                                            }.png`;
                                        fs.writeFileSync(
                                            path,
                                            Buffer.from(dataImg, "utf-8")
                                        );
                                        return api.sendMessage(
                                            {
                                                body:
                                                    "chúc mừng 2 bạn đã đạt level thân mật " +
                                                    level,
                                                attachment:
                                                    fs.createReadStream(path),
                                            },
                                            event.threadID,
                                            () => fs.unlinkSync(path)
                                        );
                                    });
                                } else
                                    return api.sendMessage(
                                        {
                                            body: `Hệ thống hoàn thành\nĐã tặng thành công ${input_2} ${
                                                get_item_send.type
                                            } và cộng ${
                                                parseInt(
                                                    get_item_send.thanmat
                                                ) * parseInt(input_2)
                                            } điểm thân mật cho ${
                                                (
                                                    await Users.getData(
                                                        handleReply.data.user
                                                            .uid
                                                    )
                                                ).name
                                            }`,
                                            attachment:
                                                fs.createReadStream(path),
                                        },
                                        event.threadID,
                                        (err, info) => {
                                            fs.unlinkSync(path);
                                        },
                                        event.messageID
                                    );
                            } else return api.sendMessage("Tặng vật phẩm thất bại", event.threadID);
                        });
                    }
                }
            } else
                return api.sendMessage(
                    "sai định dạng:\nVí dụ: 1x5",
                    event.threadID
                );
    }
};

module.exports.handleReaction = async function ({
    args,
    event,
    api,
    handleReaction,
    Users,
}) {
    if (String(event.userID) !== String(handleReaction.author))
        return api.sendMessage(
            "Bạn không phải là " +
                (await Users.getData(handleReaction.data.uid_2)).name,
            event.threadID
        );
    switch (handleReaction.type) {
        case "setlq":
            if (event.reaction === "❤") {
                api.unsendMessage(handleReaction.messageID);
                axios({
                    method: "POST",
                    url: "https://dev-ndk.id.vn/api/v1/setlq/set",
                    data: {
                        uid_1: handleReaction.data.uid_1,
                        uid_2: handleReaction.data.uid_2,
                        type: handleReaction.data.type,
                    },
                })
                    .then(function ({ data: res }) {
                        if (res.status) {
                            var mgsType =
                                handleReaction.data.type === "setlove"
                                    ? "love"
                                    : handleReaction.data.type === "setae"
                                    ? "anh em"
                                    : handleReaction.data.type === "setce"
                                    ? "chị em"
                                    : handleReaction.data.type === "setbb"
                                    ? "bạn bè"
                                    : "";
                            api.sendMessage(
                                `Hệ thống xác nhận 2 bạn đã chính thức set ${mgsType} với nhau, chúc 2 bạn mãi có 1 ${mgsType} bền lâu nhé!`,
                                event.threadID,
                                async function (err, info) {
                                    await new Promise((resolve) =>
                                        setTimeout(resolve, 10 * 1000)
                                    );
                                    api.unsendMessage(info.messageID);
                                    const { userID, name } =
                                        await Users.getData(
                                            handleReaction.data.uid_1
                                        );
                                    const newName = name.split(" ");
                                    const { data: data_uid_1 } = await axios({
                                        method: "POST",
                                        url: "https://dev-ndk.id.vn/api/v1/setlq/getdata",
                                        data: {
                                            uid: userID,
                                            name: newName[newName.length - 1],
                                        },
                                    });
                                    const data_set = data_uid_1.list_setlq.find(
                                        (item) =>
                                            item.uid ===
                                            String(handleReaction.data.uid_2)
                                    );
                                    return axios({
                                        method: "POST",
                                        url: `https://dev-ndk.id.vn/api/v1/setlq/setlq_card`,
                                        data: qs.stringify({
                                            type: handleReaction.data.type,
                                            than_mat: data_set.than_mat,
                                            lv_than_mat: data_set.lv_than_mat,
                                            so_ngay: day(moment(data_set.days)),
                                            nam: data_set.yyyy,
                                            ngay_thang: data_set.mm_dd,
                                            name_1: data_uid_1.name,
                                            name_2: data_set.name,
                                            uid_1: data_uid_1.uid,
                                            uid_2: data_set.uid,
                                        }),
                                        responseType: "arraybuffer",
                                    }).then(async function ({ data: dataImg }) {
                                        const path =
                                            __dirname +
                                            `/src/${new Date().getTime()}_${
                                                event.senderID
                                            }.png`;
                                        fs.writeFileSync(
                                            path,
                                            Buffer.from(dataImg, "utf-8")
                                        );
                                        const ngay_thang = moment
                                            .tz("Asia/Ho_Chi_minh")
                                            .format("DD/MM/YYYY");
                                        const time = moment
                                            .tz("Asia/Ho_Chi_minh")
                                            .format("hh:mm");
                                        var msg = `Đây là lá thư xác nhận cho tình ${mgsType} của 2 bạn:\nNgày bắt đầu: ${ngay_thang}\nVào lúc: ${time}\nSau khi bạn nhận được lá thư này đồng nghĩa bạn là ${mgsType} của nhau và muốn tăng độ thân mật hãy dùng setlq tang nhé!`;
                                        return api.sendMessage(
                                            {
                                                body: msg,
                                                attachment:
                                                    fs.createReadStream(path),
                                            },
                                            event.threadID,
                                            () => fs.unlinkSync(path)
                                        );
                                    });
                                }
                            );
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            } else {
                const mgsType_2 =
                    handleReaction.data.type === "setlove"
                        ? "love"
                        : handleReaction.data.type === "setae"
                        ? "anh em"
                        : handleReaction.data.type === "setce"
                        ? "chị em"
                        : handleReaction.data.type === "setbb"
                        ? "bạn bè"
                        : "";
                api.unsendMessage(handleReaction.messageID);
                return api.sendMessage(
                    `${
                        (await Users.getData(handleReaction.data.uid_2)).name
                    }\nĐã từ chối set ${mgsType_2} với bạn!`,
                    event.threadID
                );
            }
    }
};

function day(dob) {
    const currentDate = moment.tz("Asia/Ho_Chi_Minh");
    var currentDay = parseInt(currentDate.format("D"));
    var currentMonth = parseInt(currentDate.format("M"));
    var currentYear = parseInt(currentDate.format("YYYY"));
    var currentHour = parseInt(currentDate.format("HH"));
    var currentMinute = parseInt(currentDate.format("mm"));
    var currentSecond = parseInt(currentDate.format("ss"));
    var currentMoment = moment({
        years: currentYear,
        months: currentMonth - 1,
        days: currentDay,
        hours: currentHour,
        minutes: currentMinute,
        seconds: currentSecond,
    });
    const current = moment(currentMoment);
    const days = current.diff(dob, "days");

    return parseInt(days) + 1;
}
