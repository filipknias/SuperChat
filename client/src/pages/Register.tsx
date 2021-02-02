import React, { useState } from "react";
// React router dom
import { Link } from "react-router-dom";
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
  SimpleGrid,
  Link as ChakraLink,
  Button,
  Image,
} from "@chakra-ui/react";
// Images
import AppLogo from "../assets/app-logo.svg";

const Register: React.FC = () => {
  // State
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            Create your account
          </Heading>
          <Heading textAlign="center" size="md" fontWeight="400">
            Or{" "}
            <ChakraLink color="teal.400" as="span">
              <Link to="/login">sign in to your account</Link>
            </ChakraLink>
          </Heading>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <SimpleGrid columns={2} spacing={5}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </FormControl>
            </SimpleGrid>
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
            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" w="100%">
              Create account
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default Register;
