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

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfrimPassword, setShowConfirmPassword] = useState(false);

  /**
   * Functions to toggle hiding of password
   */
  const handlePasswordShowClick = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordShowClick = () => {
    setShowConfirmPassword(!showConfrimPassword);
  };

  /**
   * Functions to handle upload and submit
   */

  const postDetails = (pic) => {};

  const handleSubmit = () => {};

  return (
    <VStack spacing={"5px"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
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
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size={"md"}>
          <Input
            type={showConfrimPassword ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h="1.75rem"
              size="lg"
              onClick={handleConfirmPasswordShowClick}
              bg={"transparent"}
            >
              {showConfrimPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
