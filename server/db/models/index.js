const Conversation = require("./conversation");
const Participant = require("./participant");
const User = require("./user");
const Message = require("./message");

// associations
Conversation.belongsToMany(User, {
  through: Participant
});
User.belongsToMany(Conversation, {
  through: Participant
});

User.hasMany(Message);
Message.belongsTo(User);
Conversation.hasMany(Message);
Message.belongsTo(Conversation);

module.exports = {
  User,
  Conversation,
  Participant,
  Message
};
