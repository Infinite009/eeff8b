const Sequelize = require("sequelize");
const db = require("../db");

// it'd be great if we call this model as room or group
const Conversation = db.define("conversation", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

// need to remove the below function
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
