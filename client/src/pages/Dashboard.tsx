import React, { useEffect } from "react";
// Components
import Navbar from "../components/Navbar/Navbar";
import Chat from "../components/Dashboard/Chat";
import Sidebar from "../components/Dashboard/Sidebar";
// Chakra UI
import { Container, Flex } from "@chakra-ui/react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { getMessages, setMessages } from "../redux/actions/dataActions";
// Types
import { UserState } from "../redux/reducers/userReducer";
import { DataState } from "../redux/reducers/dataReducer";
import { RootState } from "../redux/store";
import { MessageFromDB } from "../redux/reducers/dataReducer";

const Dashboard: React.FC = () => {
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dataState = useSelector<RootState, DataState>((state) => state.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const { socket, messages } = dataState;
    if (!socket) return;

    if (userState.data) {
      dispatch(getMessages(userState.data?.user.user_id));
    }

    socket.on("receive-message", async (message: MessageFromDB) => {
      dispatch(setMessages([...messages, message]));
    });

    return () => {
      if (socket) {
        socket.off("receive-message");
      }
    };
  }, []);

  return (
    <Flex direction="column" h="100%">
      <Navbar />
      <Container flex={1} maxW="3xl" my={5} px={{ base: 2 }} centerContent>
        <Flex w="100%" h="100%" direction={{ base: "column", md: "row" }}>
          <Sidebar />
          <div style={{ flex: 1 }}>
            <Chat />
          </div>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Dashboard;
