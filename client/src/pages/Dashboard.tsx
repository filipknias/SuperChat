import React from "react";
// Components
import Navbar from "../components/Navbar/Navbar";
import Chat from "../components/Dashboard/Chat";
// Chakra UI
import { Container, Flex } from "@chakra-ui/react";
// Redux
import { useSelector } from "react-redux";
// Types
import { RootState } from "../redux/store";
import { DataState } from "../redux/reducers/dataReducer";

const Dashboard = () => {
  // Hooks
  const dataState = useSelector<RootState, DataState>((state) => state.data);

  return (
    <Flex direction="column" h="100%">
      <Navbar />
      <Container flex={1} maxW="2xl" centerContent>
        {dataState.selectedUser && <Chat />}
      </Container>
    </Flex>
  );
};

export default Dashboard;
