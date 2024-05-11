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

const cloudinaryUploadUrl = process.env.REACT_APP_CLOUDINARY_UPLOAD_URL;
const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfrimPassword, setShowConfirmPassword] = useState(false);

  const { setUser } = ChatState();

  const toast = useToast();
  const history = useHistory();

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

  const postDetails = (pic) => {
    setIsLoading(true);
    if (pic === undefined) {
      throwToast("warning", "Please select an image");
      return;
    }
    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/jpg" ||
      pic.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", cloudinaryUploadPreset);
      data.append("cloud_name", cloudinaryCloudName);
      fetch(cloudinaryUploadUrl, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throwToast("error", "Upload Failed");
            console.log(data.error);
            setIsLoading(false);
          } else {
            setPic(data.url.toString());
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      throwToast("warning", "Please select a valid image (jpeg/png)");
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      throwToast("warning", "Please enter all the required fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      throwToast("warning", "Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(ApiRoutes.signUp, {
        name,
        email,
        password,
        pic,
      });
      history.push("/chats");

      throwToast("success", "Registraion successful");
      setIsLoading(false);

      localStorage.setItem(LocaltorageKeys.userInfo, JSON.stringify(data));
      setUser(JSON.parse(localStorage.getItem(LocaltorageKeys.userInfo)));
    } catch (e) {
      throwToast("error", "Signing Up Failed. Please try again later");
      setIsLoading(false);
    }
  };

  const throwToast = (status, message) => {
    toast({
      title: message,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };

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
        isLoading={isLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
