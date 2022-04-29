const Sequelize = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  lastReadId1: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  lastReadId2: {
    type: Sequelize.INTEGER,
    allowNull: true,
  }
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Sequelize.Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Sequelize.Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
