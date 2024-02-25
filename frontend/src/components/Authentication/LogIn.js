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

const LogIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [showPassword, setShowPassword] = useState(false);

  /**
   * Functions to toggle hiding of password
   */
  const handlePasswordShowClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {};

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
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
