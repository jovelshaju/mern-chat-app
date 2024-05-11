import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ApiRoutes from "../../constants/ApiRoutes";
import LocaltorageKeys from "../../constants/LocalStorageKeys";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ChatState } from "../../context/ChatProvider";

const LogIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const { setUser } = ChatState();

  /**
   * Functions to toggle hiding of password
   */
  const handlePasswordShowClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!email || !password) {
      throwToast("warning", "Please enter all the required fields");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(ApiRoutes.login, {
        email,
        password,
      });
      history.push("/chats");

      throwToast("success", "Login successful");
      setIsLoading(false);

      localStorage.setItem(LocaltorageKeys.userInfo, JSON.stringify(data));
      setUser(JSON.parse(localStorage.getItem(LocaltorageKeys.userInfo)));
    } catch (e) {
      throwToast("error", "Logging In Failed", e.response.data.message);
      setIsLoading(false);
    }
  };

  const throwToast = (status, message, description) => {
    toast({
      title: message,
      status: status,
      duration: 5000,
      isClosable: true,
      description: description ?? "",
    });
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size={"md"}>
          <Input
            value={password}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h="1.75rem"
              size="lg"
              onClick={handlePasswordShowClick}
              bg={"transparent"}
            >
              {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
      >
        Log In
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default LogIn;
