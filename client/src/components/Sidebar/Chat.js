import React, { useState, useEffect } from 'react';
import { Box, Badge } from '@material-ui/core';
import { BadgeAvatar, ChatContent } from '../Sidebar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: '0 2px 10px 0 rgba(88,133,196,0.05)',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'grab',
    },
  },
  badge: {
    "& span": {
      transform: "translate(0%, -50%)"
    }
  }
}));

const Chat = ({ conversation, setActiveChat }) => {
  const classes = useStyles();
  const { otherUser } = conversation;
  const [unreadCount, setUnreadCount] = useState(0);

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
  };

  useEffect(() => {
    const { lastReadId, otherUser } = conversation;
    setUnreadCount(conversation.messages
      .filter(({ id, senderId }) => id > lastReadId && senderId === otherUser.id).length);
  }, [conversation]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} unreadCount={unreadCount} />
      {unreadCount > 0 && <Badge badgeContent={unreadCount} color="primary" className={classes.badge} />}
    </Box>
  );
};

export default Chat;
