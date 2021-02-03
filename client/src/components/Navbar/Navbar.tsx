import React from "react";
// Components
import ProfilePopover from "./ProfilePopover";
// Chakra UI
import {
  Box,
  Link as ChakraLink,
  Container,
  Grid,
  Input,
} from "@chakra-ui/react";

const Navbar: React.FC = () => {
  return (
    <Box
      w="100vw"
      bg="red.500"
      color="white"
      px={{ base: 1, lg: 3 }}
      py={{ base: 2, lg: 3 }}
    >
      <Container maxW="3xl">
        <Grid
          templateColumns="1fr auto"
          gap={{ base: 5, lg: 10 }}
          alignItems="center"
        >
          <Input
            type="text"
            bg="white"
            color="black"
            placeholder="Chat with people"
          />
          <ProfilePopover />
        </Grid>
      </Container>
    </Box>
  );
};

export default Navbar;
