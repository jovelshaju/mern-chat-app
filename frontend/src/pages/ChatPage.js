import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Header from "../components/Miscellaneous/Header";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();

  const [fetchChats, setFetchChats] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        h={"91.5vh"}
        w={"100%"}
        p={"10px"}
      >
        {user && <MyChats fetchChats={fetchChats} />}
        {user && <ChatBox setFetchChats={setFetchChats} />}
      </Box>
    </div>
  );
};

export default ChatPage;
