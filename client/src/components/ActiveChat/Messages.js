import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Avatar } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  avatar: {
    height: 20,
    width: 20,
    marginTop: 9,
    float: "right"
  }
}));

const Messages = (props) => {
  const { messages, otherUser, userId, lastReadId, updateLastReadId, conversationId } = props;
  const classes = useStyles();

  useEffect(() => {
    let latestId = 0;
    for (let i = messages.length - 1; i >= 0; i --)
      if (messages[i].senderId !== userId ) {
        latestId = messages[i].id;
        break;
      }
    if (latestId > lastReadId) updateLastReadId(conversationId, latestId);
  }, [messages, lastReadId, updateLastReadId, conversationId, userId]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <div key={message.id}>
            <SenderBubble text={message.text} time={time} />
            {message.id === otherUser.lastReadId &&
              <Avatar
                alt={otherUser.username}
                src={otherUser.photoUrl}
                className={classes.avatar}
              />
            }
          </div>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
