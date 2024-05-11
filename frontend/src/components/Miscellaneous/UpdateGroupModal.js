import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Spinner,
  useToast,
  Box,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import ApiRoutes from "../../constants/ApiRoutes";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

const UpdateGroupModal = ({ setFetchChats }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [chatName, setChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  /**
   * Function to handle renaming of group
   */
  const handleRename = async () => {
    if (!chatName) {
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const request = {
        groupName: chatName,
        chatId: selectedChat._id,
      };

      const { data } = await axios.put(ApiRoutes.renameGroup, request, config);

      setSelectedChat(data);
      setFetchChats(true);

      toast({
        title: "Renamed group successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      toast({
        title: "Renaming group failed",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    setRenameLoading(false);
    setChatName("");
  };

  /**
   * Function to search for users
   * @param {*} searchValue
   */
  const handleSearch = async (searchValue) => {
    setSearch(searchValue);
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

  /**
   * Function to handle Add user
   * @param {*} selectedUser
   */
  const handleAddUser = async (selectedUser) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const request = {
        userId: selectedUser._id,
        chatId: selectedChat._id,
      };

      const { data } = await axios.put(ApiRoutes.addGroupUser, request, config);

      setSelectedChat(data);

      toast({
        title: "Added user successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      toast({
        title: "Adding user failed",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    setSearch("");
    setSearchResult([]);
  };

  /**
   * Function to remove a user
   * @param {*} id
   */
  const handleRemoveUser = async (id) => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const request = {
        userId: id,
        chatId: selectedChat._id,
      };

      const { data } = await axios.put(
        ApiRoutes.removeGroupUser,
        request,
        config
      );

      setSelectedChat(data);

      toast({
        title: "Removed user successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      toast({
        title: "Removing user failed",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const handleLeaveGroup = async () => {
    await handleRemoveUser(user.id);
    setSelectedChat(null);
    setFetchChats(true);
    handleModalClose();
  };
  /**
   * Function to handle modal close
   */
  const handleModalClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"}>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  onClick={() => handleRemoveUser(u._id)}
                ></UserBadgeItem>
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat name"
                mb={3}
                value={chatName}
                onChange={(e) => {
                  setChatName(e.target.value);
                }}
              ></Input>
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user"
                mb={1}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                value={search}
              ></Input>
            </FormControl>
            {isLoading ? (
              <Spinner />
            ) : (
              searchResult?.slice(0, 4).map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  onClick={() => {
                    handleAddUser(u);
                  }}
                ></UserListItem>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
