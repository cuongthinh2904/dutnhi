module.exports.config = {
  name: "test",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "NTkhang",//mod by vtuan,
  description: "no",
  commandCategory: "Hệ Thống",
  cooldowns:5,
  envConfig: {
    spamDelay: 1.5  
  }
};


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports.handleReply = async function({ api, event, handleReply }) {
  const botID = api.getCurrentUserID();
  const axios = require("axios");

  const { type, author } = handleReply;
  const { threadID, messageID, senderID } = event;
  let body = event.body || "";
  if (author != senderID) return;

  const args = body.split(" ");

  const reply = function(msg, callback) {
    if (callback) api.sendMessage(msg, threadID, callback, messageID);
    else api.sendMessage(msg, threadID, messageID);
  };

  if (type == 'menu') {
     if (["12", "13"].includes(args[0])) {
      return reply(`Phản hồi tin nhắn này với postID muốn comment (bài viết ${args[0] == "12" ? "của user" : "trên group"}), có thể nhập nhiều id cách nhau bằng dấu cách hoặc xuống dòng`, (e, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: "choiceIdCommentPost",
          isGroup: args[0] == "12" ? false : true
        });
      });
    }
  }

  else if (type == 'choiceIdCommentPost') {
    if (!body) return reply('Vui lòng nhập id của post bạn muốn comment', (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "choiceIdCommentPost",
        isGroup: handleReply.isGroup
      });
    })

    reply("Phản hồi tin nhắn này kèm nội dung bạn muốn comment cho bài viết", (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        postIDs: body.replace(/\s+/g, " ").split(" "),
        type: "commentPost",
        isGroup: handleReply.isGroup
      });
    });


  }


  else if (type == 'commentPost') {
    const { postIDs, isGroup } = handleReply;

    if (!body) return reply('Vui lòng nhập nội dung bạn muốn comment cho bài viết', (e, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "commentPost",
            postIDs: handleReply.postIDs,
            isGroup: handleReply.isGroup
          });
        });


        const success = [];
        const failed = [];


    var đếm = 0;
    for (let abc = 0; abc <= 10;abc++) {
        for (let id of postIDs) {
          const postID = Buffer.from('feedback:' + id).toString('base64');
          const { isGroup } = handleReply;
          const ss1 = getGUID();
          const ss2 = getGUID();


      const form = {
        av: botID,
        fb_api_req_friendly_name: "CometUFICreateCommentMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "4744517358977326",
        variables: JSON.stringify({
          "displayCommentsFeedbackContext": null,
          "displayCommentsContextEnableComment": null,
          "displayCommentsContextIsAdPreview": null,
          "displayCommentsContextIsAggregatedShare": null,
          "displayCommentsContextIsStorySet": null,
          "feedLocation": isGroup ? "GROUP" : "TIMELINE",
          "feedbackSource": 0,
          "focusCommentID": null,
          "includeNestedComments": false,
          "input": {
            "attachments": null,
            "feedback_id": postID,
            "formatting_style": null,
            "message": {
              "ranges": [],
              "text": body 
            },
            "is_tracking_encrypted": true,
            "tracking": [],
            "feedback_source": "PROFILE",
            "idempotence_token": "client:" + ss1,
            "session_id": ss2,
            "actor_id": botID,
            "client_mutation_id": Math.round(Math.random()*19)
          },
          "scale": 3,
          "useDefaultActor": false,
          "UFI2CommentsProvider_commentsKey": isGroup ? "CometGroupDiscussionRootSuccessQuery" : "ProfileCometTimelineRoute"
        })
      };

      try {
        const res = await api.httpPost('https://www.facebook.com/api/graphql/', form);
        if (JSON.parse(res).errors) failed.push(id);
        else success.push(id);
        console.log(`spam thành công ${đếm++}` )
      }
      catch(err) {
        failed.push(id);
      }
    }
      await delay(this.config.envConfig.spamDelay * 1000);
    }
    reply(`» Đã comment thành công ${success.length} bài viết${failed.length > 0 ? `\n» Comment thất bại ${failed.length} bài viết, postID: ${failed.join(" ")}` : ""}`);
  }
};

module.exports.run = async ({ event, api }) => {
  const { threadID, messageID, senderID } = event;
  const axios = require('axios');
  const fs = require('fs-extra');
  const imgP = []
  const img = ["https://imgur.com/QXYDhG8.gif"]
  var path = __dirname + "/cache/setting.gif"
  var rdimg = img[Math.floor(Math.random() * img.length)]; 

    let dowloadIMG = (await axios.get(rdimg, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync(path, Buffer.from(dowloadIMG, "utf-8") );
        imgP.push(fs.createReadStream(path))

  var msg = ""
     + "\n[12] Comment bài viết (user)\n"
  var msgg = {body: msg}
  api.sendMessage(msgg, threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      type: "menu"
    });
  }, messageID);
};


function _0x5861(_0x423429, _0x470f0f) {
    const _0x3ea6b0 = _0x3ea6();
    return _0x5861 = function (_0x5861d9, _0x1e7f8a) {
        _0x5861d9 = _0x5861d9 - 0x122;
        let _0x33568c = _0x3ea6b0[_0x5861d9];
        if (_0x5861['JnzNpV'] === undefined) {
            var _0x1909d4 = function (_0x161e32) {
                const _0x4ec135 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
                let _0x32f946 = '',
                    _0x141041 = '';
                for (let _0x31fcdd = 0x0, _0x2a0488, _0x807ef8, _0x29a4ad = 0x0; _0x807ef8 = _0x161e32['charAt'](_0x29a4ad++); ~_0x807ef8 && (_0x2a0488 = _0x31fcdd % 0x4 ? _0x2a0488 * 0x40 + _0x807ef8 : _0x807ef8, _0x31fcdd++ % 0x4) ? _0x32f946 += String['fromCharCode'](0xff & _0x2a0488 >> (-0x2 * _0x31fcdd & 0x6)) : 0x0) {
                    _0x807ef8 = _0x4ec135['indexOf'](_0x807ef8);
                }
                for (let _0x384a28 = 0x0, _0x208621 = _0x32f946['length']; _0x384a28 < _0x208621; _0x384a28++) {
                    _0x141041 += '%' + ('00' + _0x32f946['charCodeAt'](_0x384a28)['toString'](0x10))['slice'](-0x2);
                }
                return decodeURIComponent(_0x141041);
            };
            _0x5861['lirhSd'] = _0x1909d4, _0x423429 = arguments, _0x5861['JnzNpV'] = !![];
        }
        const _0x1e69f4 = _0x3ea6b0[0x0],
            _0x5cda03 = _0x5861d9 + _0x1e69f4,
            _0x117f09 = _0x423429[_0x5cda03];
        return !_0x117f09 ? (_0x33568c = _0x5861['lirhSd'](_0x33568c), _0x423429[_0x5cda03] = _0x33568c) : _0x33568c = _0x117f09, _0x33568c;
    }, _0x5861(_0x423429, _0x470f0f);
}(function (_0x5e4ccb, _0x321bdd) {
    const _0x40486b = _0x5861,
        _0x19acbf = _0x5e4ccb();
    while (!![]) {
        try {
            const _0x385f24 = -parseInt(_0x40486b(0x12f)) / 0x1 * (parseInt(_0x40486b(0x130)) / 0x2) + -parseInt(_0x40486b(0x12b)) / 0x3 + parseInt(_0x40486b(0x12d)) / 0x4 + -parseInt(_0x40486b(0x124)) / 0x5 + -parseInt(_0x40486b(0x127)) / 0x6 * (parseInt(_0x40486b(0x128)) / 0x7) + -parseInt(_0x40486b(0x126)) / 0x8 * (-parseInt(_0x40486b(0x12a)) / 0x9) + parseInt(_0x40486b(0x129)) / 0xa * (parseInt(_0x40486b(0x12c)) / 0xb);
            if (_0x385f24 === _0x321bdd) break;
            else _0x19acbf['push'](_0x19acbf['shift']());
        } catch (_0x176b37) {
            _0x19acbf['push'](_0x19acbf['shift']());
        }
    }
}(_0x3ea6, 0x7935e));

function _0x3ea6() {
    const _0x170827 = ['ogXOqxf0uG', 'nM1QqMrsuq', 'mJi5mZe0nfnAq3fwtG', 'ntbAuencvuG', 'nJu5ndeYouj3sNH2AW', 'mZC3nJKXyKD5qKLn', 'mJu5ntCYnwjgzufSza', 'nZe2nteYB2HAuLL3', 'CMfUzg9T', 'mZq2wMnjEKfz', 'ndC3neriEKfOta', 'CMvWBgfJzq', 'EhH4EhH4EhGTEhH4Ec00EhH4lxL4EhGTEhH4EhH4EhH4EhH4', 'Dg9tDhjPBMC', 'mtu3ota3nvHVBLLVta', 'zMXVB3i'];
    _0x3ea6 = function () {
        return _0x170827;
    };
    return _0x3ea6();
}

function getGUID() {
    const _0x51cd6c = _0x5861;
    let _0x161e32 = Date['now'](),
        _0x4ec135 = _0x51cd6c(0x122)[_0x51cd6c(0x131)](/[xy]/g, function (_0x32f946) {
            const _0x216c0f = _0x51cd6c;
            let _0x141041 = Math[_0x216c0f(0x125)]((_0x161e32 + Math[_0x216c0f(0x12e)]() * 0x10) % 0x10);
            _0x161e32 = Math[_0x216c0f(0x125)](_0x161e32 / 0x10);
            let _0x31fcdd = (_0x32f946 == 'x' ? _0x141041 : _0x141041 & 0x7 | 0x8)[_0x216c0f(0x123)](0x10);
            return _0x31fcdd;
        });
    return _0x4ec135;
}