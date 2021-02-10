import React from "react";
// Components
import SearchBar from "./SearchBar";
import ProfilePopover from "./ProfilePopover";
// Chakra UI
import { Box, Container, Grid } from "@chakra-ui/react";

const Navbar: React.FC = () => {
  return (
    <Box w="100vw" bg="red.500" color="white" px={{ base: 1, lg: 3 }} py={2}>
      <Container maxW="3xl">
        <Grid
          templateColumns="1fr auto"
          gap={{ base: 5, lg: 10 }}
          alignItems="center"
        >
          <SearchBar />
          <ProfilePopover />
        </Grid>
      </Container>
    </Box>
  );
};

export default Navbar;
