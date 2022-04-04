const Conversation = require("./conversation");
const Participant = require("./participant");
const User = require("./user");
const Message = require("./message");

// associations

Conversation.hasMany(Participant);
Participant.belongsTo(Conversation);
User.hasMany(Participant);
Participant.belongsTo(User);
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
