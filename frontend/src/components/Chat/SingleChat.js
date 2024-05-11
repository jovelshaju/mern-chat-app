import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../Miscellaneous/ProfileModal";
import UpdateGroupModal from "../Miscellaneous/UpdateGroupModal";

const SingleChat = ({ setFetchChats }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const getSender = () => {
    return user.id === selectedChat.users[0]._id
      ? selectedChat.users[1]
      : selectedChat.users[0];
  };
  return (
    <>
      {selectedChat ? (
        <>
          {/* Title */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            alignItems={"center"}
            fontFamily={"Work sans"}
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat(null);
              }}
            />
            {selectedChat.chatName}
            {!selectedChat.isGroupChat ? (
              <>
                <ProfileModal user={getSender()}></ProfileModal>
              </>
            ) : (
              <>
                <UpdateGroupModal
                  setFetchChats={setFetchChats}
                ></UpdateGroupModal>
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            padding={3}
            background={"#E8E8E8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          ></Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user or group to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
