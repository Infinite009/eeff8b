const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "lastReadId1", "lastReadId2"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
        convoJSON.lastReadId = convoJSON.lastReadId2 || 0;
        convoJSON.otherUser.lastReadId = convoJSON.lastReadId1 || 0;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
        convoJSON.lastReadId = convoJSON.lastReadId1 || 0;
        convoJSON.otherUser.lastReadId = convoJSON.lastReadId2 || 0;
      }
      delete convoJSON.lastReadId1;
      delete convoJSON.lastReadId2;

      convoJSON.unreadCount = await Message.count({
        where: {
          conversationId: convoJSON.id,
          id: { [Op.gt]: convoJSON.lastReadId },
          senderId: convoJSON.otherUser.id
        }
      });

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.messages.reverse();
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch("/last-read", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);

    const { id, lastReadId } = req.body;
    if (!id || !lastReadId) return res.sendStatus(400);

    const senderId = req.user.id;
    const convo = await Conversation.findOne({ where: { id }, attributes: ["user1Id", "user2Id"] });

    let updateClause;
    if (senderId === convo.user1Id) updateClause = { lastReadId1: lastReadId };
    else if (senderId === convo.user2Id) updateClause = { lastReadId2: lastReadId };
    else return res.sendStatus(403);

    await Conversation.update(updateClause, { where: { id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
