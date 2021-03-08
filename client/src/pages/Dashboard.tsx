import React from "react";
// Components
import Navbar from "../components/Navbar/Navbar";
import Chat from "../components/Dashboard/Chat";
import Sidebar from "../components/Dashboard/Sidebar";
// Chakra UI
import { Container, Flex } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Flex direction="column" h="100%">
      <Navbar />
      <Container flex={1} maxW="3xl" my={5} centerContent>
        <Flex w="100%" h="100%">
          <Sidebar />
          <div style={{ flex: 1, minWidth: "80%" }}>
            <Chat />
          </div>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Dashboard;
