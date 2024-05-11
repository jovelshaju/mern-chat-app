import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import LocaltorageKeys from "../../constants/LocalStorageKeys";
import SideDrawer from "./SideDrawer";

const Header = () => {
  const { user, setUser } = ChatState();
  const history = useHistory();

  const logOutHandler = () => {
    history.push("/");
    localStorage.removeItem(LocaltorageKeys.userInfo);
    setUser(null);
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        borderWidth={"5px"}
        padding={"5px 10px 5px 10px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <SideDrawer user={user}>
            <Button variant={"ghost"}>
              <Search2Icon />
              <Text
                display={{ base: "none", md: "flex" }}
                p={"4px"}
                marginBottom={"2px"}
              >
                Search User
              </Text>
            </Button>
          </SideDrawer>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" color="black">
          Talkie-Talkie
        </Text>
        <div>
          <Menu>
            <Tooltip label="Notifications" hasArrow placement="bottom">
              <MenuButton p={"1px"}>
                <BellIcon fontSize={"2xl"} m={"1"}></BellIcon>
              </MenuButton>
            </Tooltip>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant={"ghost"}
            >
              <Avatar size={"sm"} name={user.name} src={user.pic}></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default Header;
