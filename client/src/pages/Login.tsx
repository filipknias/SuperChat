import React, { useState } from "react";
// React router dom
import { Link, useHistory } from "react-router-dom";
// Chakra UI
import {
  Center,
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Flex,
  Checkbox,
  Link as ChakraLink,
  Button,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
// Images
import AppLogo from "../assets/app-logo.svg";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/userActions";
// Types
import { RootState } from "../redux/store";
import { UserState } from "../redux/reducers/userReducer";

const Login: React.FC = () => {
  // State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  // Hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const userState = useSelector<RootState, UserState>((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(email, password, rememberMe, history));
  };

  return (
    <Center w="100vw" h="100vh">
      <Box
        bg="white"
        p={5}
        borderWidth={1}
        boxShadow="lg"
        minW={{ base: "350px", md: "500px" }}
      >
        <Flex alignItems="center" mb={8}>
          <Image src={AppLogo} alt="App Logo" height="40px" mr={2} />
          <Heading size="md" fontWeight="400">
            SuperChat
          </Heading>
        </Flex>
        <Stack spacing={1} mb={8}>
          <Heading textAlign="center" size="lg" color="black" fontWeight="500">
            Sign in to your account
          </Heading>
          <Heading textAlign="center" size="md" fontWeight="400">
            Or{" "}
            <ChakraLink color="teal.400" as="span">
              <Link to="/register">create your account here</Link>
            </ChakraLink>
          </Heading>
        </Stack>
        {userState.error && userState.error.general && (
          <Alert status="error" mb={5}>
            <AlertIcon />
            <AlertTitle mr={2}>{userState.error.general}</AlertTitle>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <Stack isInline justifyContent="space-between">
              <FormControl as="fieldset" flex={1}>
                <Checkbox
                  defaultChecked={rememberMe}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember Me
                </Checkbox>
              </FormControl>
              <ChakraLink color="teal.400" as="div">
                <Link to="/reset-password">Forgot your password ?</Link>
              </ChakraLink>
            </Stack>
            <Button
              type="submit"
              colorScheme="blue"
              w="100%"
              isLoading={userState.loading}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default Login;
