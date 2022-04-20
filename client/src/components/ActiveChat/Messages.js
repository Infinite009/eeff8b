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
  const { messages, otherUser, userId, updateLastReadId, conversationId, unreadCount } = props;
  const classes = useStyles();

  useEffect(() => {
    if (unreadCount === 0) return;
    
    for (let i = messages.length - 1; i >= 0; i --)
      if (messages[i].senderId !== userId ) {
        updateLastReadId(conversationId, messages[i].id);
        return;
      }
  }, [messages, updateLastReadId, conversationId, unreadCount, userId]);

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
