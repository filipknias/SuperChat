import React, { useState, useEffect, useRef } from "react";
// Chakra UI
import {
  Box,
  Input,
  Flex,
  Heading,
  Tooltip,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
// Redux
import { useSelector } from "react-redux";
// Types
import { UserState } from "../../redux/reducers/userReducer";
import { DataState } from "../../redux/reducers/dataReducer";
import { RootState } from "../../redux/store";

interface Message {
  message: string;
  sender_id: number;
  recipient_id: number;
}

const Chat: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Hooks
  const dataState = useSelector<RootState, DataState>((state) => state.data);
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const { socket, selectedUser } = dataState;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !inputRef.current ||
      !userState.data ||
      !dataState.selectedUser ||
      !socket
    )
      return;

    const message = {
      message: inputRef.current.value,
      sender_id: userState.data?.user.user_id,
      recipient_id: dataState.selectedUser?.user_id,
    };
    socket.emit("send-message", message);

    setMessages((messages) => [...messages, message]);

    inputRef.current.value = "";
  };

  useEffect(() => {
    if (!socket || !dataState.selectedUser) return;

    socket.on("receive-message", (message: Message) => {
      if (message.sender_id === dataState.selectedUser?.user_id) {
        setMessages((messages) => [...messages, message]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, dataState.selectedUser]);

  useEffect(() => {
    // TODO: Fetch messages from database
    setMessages([]);
  }, [dataState]);

  return (
    <Flex direction="column" my={5} w="100%" h="100%" bg="white">
      <Flex
        py={3}
        px={5}
        borderBottom="1px"
        borderColor="gray.300"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading size="lg" fontWeight="400">
          {selectedUser?.full_name}
        </Heading>
        <Tooltip label="Close">
          <CloseIcon role="button" />
        </Tooltip>
      </Flex>
      <Flex direction="column" flex={1} p={3}>
        {messages.map((message, index) => (
          <Box
            key={index}
            bg={
              message.sender_id === userState.data?.user.user_id
                ? "blue"
                : "white"
            }
            color={
              message.sender_id === userState.data?.user.user_id
                ? "white"
                : "black"
            }
            borderRadius={5}
            border="1px"
            p={2}
            alignSelf={
              message.sender_id === userState.data?.user.user_id
                ? "flex-end"
                : "flex-start"
            }
            my={1}
          >
            {message.message}
          </Box>
        ))}
      </Flex>
      <form ref={formRef} onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            type="text"
            placeholder="Send message"
            size="lg"
            borderRadius={0}
            ref={inputRef}
            required
          />
          <InputRightElement
            h="100%"
            children={
              <Tooltip label="Send">
                <ChatIcon
                  onClick={() => formRef.current?.submit()}
                  role="button"
                />
              </Tooltip>
            }
          />
        </InputGroup>
      </form>
    </Flex>
  );
};

export default Chat;
