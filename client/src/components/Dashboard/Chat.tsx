import React, { useState, useEffect, useRef } from "react";
// Components
import Message from "./Message";
// Chakra UI
import {
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
import { UserState, UserData } from "../../redux/reducers/userReducer";
import { DataState } from "../../redux/reducers/dataReducer";
import { RootState } from "../../redux/store";

interface Message {
  message: string;
  sender_user: UserData;
  recipient_id: number;
  created_at: Date;
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
    if (!inputRef.current || !userState.data || !selectedUser || !socket)
      return;

    const message = {
      message: inputRef.current.value,
      sender_user: userState.data?.user,
      recipient_id: selectedUser?.user_id,
      created_at: new Date(),
    };
    socket.emit("send-message", message);

    setMessages((messages) => [...messages, message]);

    inputRef.current.value = "";
  };

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("receive-message", (message: Message) => {
      if (message.sender_user.user_id === selectedUser?.user_id) {
        setMessages((messages) => [...messages, message]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    // TODO: Fetch messages from database
    setMessages([]);
  }, [selectedUser]);

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
          <Message
            key={index}
            photoUrl={
              message.sender_user.photo_url === null
                ? undefined
                : message.sender_user.photo_url
            }
            name={message.sender_user.full_name}
            message={message.message}
            color={
              message.sender_user.user_id === userState.data?.user.user_id
                ? "blue"
                : "white"
            }
            boxAlign={
              message.sender_user.user_id === userState.data?.user.user_id
                ? "flex-end"
                : "flex-start"
            }
            createdAt={message.created_at}
          />
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
