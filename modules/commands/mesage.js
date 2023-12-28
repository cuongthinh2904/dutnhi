const fs = require('fs-extra');
const path = require('path');
const messageCountFolderPath = path.join(__dirname, '../../modules/commands/cache/data/messageCount');
fs.ensureDirSync(messageCountFolderPath);
module.exports.config = {
  name: "msgcount",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "Vtuan",
  description: "Tính số lượng tin nhắn của mỗi thành viên.",
  commandCategory: "Tiện Ích",
  usages: "[ID hoặc all]",
  cooldowns: 5
};
async function createIfNotExist(filePath) {
  if (!await fs.pathExists(filePath)) {
    await fs.writeJson(filePath, []);
  }
}
module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;
  const threadFilePath = path.join(messageCountFolderPath, `${threadID}.json`);
  await createIfNotExist(threadFilePath);
  if (args[0] === "all") {
    let messageCountData = await fs.readJson(threadFilePath);
    messageCountData.sort((a, b) => b.count - a.count); // Sắp xếp từ lớn đến nhỏ
    let msg = 'Tổng số tin nhắn của tất cả thành viên:\n';
    for (const userInfo of messageCountData) {
      let userName = (await api.getUserInfo(userInfo.userID))[userInfo.userID].name;
      msg += `${userName}: ${userInfo.count} tin nhắn\n`;
    }
    api.sendMessage(msg.trim(), threadID);
  } else {
    let messageCountData = await fs.readJson(threadFilePath);
    const userID = args[0] || event.senderID;
    const userMessageData = messageCountData.find(user => user.userID === userID);
    if (userMessageData) {
      const userName = (await api.getUserInfo(userID))[userID].name;
      api.sendMessage(`${userName}: ${userMessageData.count} tin nhắn`, threadID);
    } else {
      api.sendMessage(`Không tìm thấy số lượng tin nhắn cho userID: ${userID}`, threadID);
    }
  }
};
async function addNewMembersToMessageCount(api, threadID) {
  const threadFilePath = path.join(messageCountFolderPath, `${threadID}.json`);
  let messageCountData = await fs.readJson(threadFilePath);
  const threadInfo = await api.getThreadInfo(threadID);
  const currentParticipantIDs = new Set(threadInfo.participantIDs);
  for (const userID of currentParticipantIDs) {
    if (!messageCountData.some(user => user.userID === userID)) {
      messageCountData.push({ userID, count: 0 });
    }
  }
  messageCountData.sort((a, b) => b.count - a.count);
  messageCountData.forEach((user, index) => {
    user.rank = index + 1;
  });
  await fs.writeJson(threadFilePath, messageCountData);
}

module.exports.handleEvent = async ({ api, event }) => {
  const threadID = event.threadID.toString();
  const senderID = event.senderID.toString();
  const threadFilePath = path.join(messageCountFolderPath, `${threadID}.json`);

  // Ensure the message count file for the thread exists.
  await createIfNotExist(threadFilePath);

  // Read the current message counts data from the file.
  let messageCountData = await fs.readJson(threadFilePath);

  // Get user names and update message count for the sender.
  let senderData = messageCountData.find(u => u.userID === senderID);

  if (!senderData) {
    const threadInfo = await api.getThreadInfo(threadID);
    
    for (const userID of threadInfo.participantIDs) {
      if (!messageCountData.some(u => u.userID === userID)) {
        // Fetch user names in batches or individually, depending on your API's capabilities.
        const userInfo = await api.getUserInfo(userID);
        const userName = userInfo[userID].name || 'Unknown';

        messageCountData.push({
          userID: userID,
          name: userName,
          count: userID === senderID ? 1 : 0,
          rank: 0 
        });
      }
    }
    senderData = messageCountData.find(u => u.userID === senderID);
  } else {
    senderData.count += 1; // Increment message count
  }

  // Sort message count data and recalculate ranks.
  messageCountData.sort((a, b) => b.count - a.count);
  messageCountData.forEach((user, index) => {
    user.rank = index + 1; // Assign rank based on sorted position
  });

  // Save the updated message count data back to the file.
  await fs.writeJson(threadFilePath, messageCountData, { spaces: 2 });
};

function customStringify(arr) {
  return '[\n' + arr.map(obj => {
    const userID = `  {\n    "userID": "${obj.userID}",`; 
    const count = `\n    "count": ${obj.count},`;
    const rank = `\n    "rank": ${obj.rank}\n  }`;
    return userID + count + rank;
  }).join(',\n') + '\n]';
}