import React from "react";
// Components
import ProfilePopover from "./ProfilePopover";
// Chakra UI
import { Box, Container, Grid, Input } from "@chakra-ui/react";
// Redux
import { useSelector } from "react-redux";
// Types
import { RootState } from "../../redux/store";

const Navbar: React.FC = () => {
  // Hooks
  const userState = useSelector<RootState>((state) => state.user);

  return (
    <Box w="100vw" bg="red.500" color="white" px={{ base: 1, lg: 3 }} py={2}>
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
