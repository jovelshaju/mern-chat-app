import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "./UserListItem";
import axios from "axios";
import ApiRoutes from "../../constants/ApiRoutes";
import UserBadgeItem from "./UserBadgeItem";

const CreateGroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
   * Function to handle submit
   */
  const handleSubmit = async () => {
    if (!chatName || !selectedUsers) {
      toast({
        title: "Please provide required data",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const request = {
        groupName: chatName,
        users: selectedUsers.map((u) => u._id),
      };

      const { data } = await axios.post(ApiRoutes.createGroup, request, config);

      setChats([data, ...chats]);

      handleModalClose();

      toast({
        title: "Created group successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      toast({
        title: "Creating group failed",
        description: e.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  /**
   * Function to handle Add user
   * @param {*} selectedUser
   */
  const handleAddUser = (selectedUser) => {
    if (selectedUsers.find((x) => x._id === selectedUser._id)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      setSelectedUsers([...selectedUsers, selectedUser]);
    }
    setSearch("");
    setSearchResult([]);
  };

  /**
   * Function to remove a selected user
   * @param {*} user
   */
  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((x) => x._id !== user._id));
  };

  /**
   * Function to handle modal close
   */
  const handleModalClose = () => {
    setSelectedUsers([]);
    setSearch("");
    onClose();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"}>
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => {
                  setChatName(e.target.value);
                }}
              ></Input>
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

            <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  onClick={() => handleRemoveUser(u)}
                ></UserBadgeItem>
              ))}
            </Box>

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
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
