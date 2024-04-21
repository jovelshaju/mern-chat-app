import React, { useState } from "react";
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Box,
  Stack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import ApiRoutes from "../../constants/ApiRoutes";
import ChatTile from "../Chat/ChatTile";
import { ChatState } from "../../context/ChatProvider";

const SideDrawer = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { setSelectedChat, chats, setChats } = ChatState();

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleOnChange = async (e) => {
    setSearch(e.target.value);
    const searchValue = e.target.value;
    if (searchValue.length > 0) {
      setIsLoading(true);

      try {
        const config = {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          ApiRoutes.getUsers + searchValue,
          config
        );

        setIsLoading(false);
        setSearchResult(data);
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
    } else {
      setIsLoading(false);
      setSearchResult([]);
    }
  };

  const accesChat = async (userId) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(ApiRoutes.chat, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      onClose();
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
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={"2px"}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => handleOnChange(e)}
              />
            </Box>
            {isLoading ? (
              <Stack direction={"row"} justifyContent={"center"}>
                <Spinner />
              </Stack>
            ) : (
              searchResult?.map((userData) => (
                <ChatTile
                  key={userData._id}
                  user={userData}
                  onClick={() => accesChat(userData._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
