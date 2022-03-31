import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId, lastReadId, updateLastReadId, conversationId } = props;

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
          <SenderBubble key={message.id} text={message.text} time={time} />
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
