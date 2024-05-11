import React, { useEffect, useState } from "react";
import { useToast, Box, Button, Stack, Text, Spinner } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import ApiRoutes from "../../constants/ApiRoutes";
import CreateGroupModal from "../Miscellaneous/CreateGroupModal";

const MyChats = ({ fetchChats }) => {
  const toast = useToast();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        const config = {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(ApiRoutes.chat, config);

        setChats(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured",
          status: "error",
          duration: 5000,
          isClosable: true,
          description: error,
          position: "bottom-right",
        });
      }
    };
    fetchAllChats();
  }, [setChats, toast, user.token, fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontFamily={"Work sans"}
        fontSize={{ base: "28px", md: "30px" }}
        alignItems={"center"}
        justifyContent={"space-between"}
        display={"flex"}
        width={"100%"}
      >
        My Chats
        <CreateGroupModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </CreateGroupModal>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        p={"3"}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {isLoading ? (
          <Stack direction={"row"} justifyContent={"center"}>
            <Spinner />
          </Stack>
        ) : (
          <Stack overflowY={"scroll"}>
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8EE8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>{chat.chatName}</Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
