import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// Images
import UsersImage from "../../assets/users.svg";
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
  Center,
  Image,
} from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedUser,
  setMessages as setMessagesState,
} from "../../redux/actions/dataActions";
// Types
import { UserState } from "../../redux/reducers/userReducer";
import { DataState, MessageFromDB } from "../../redux/reducers/dataReducer";
import { RootState } from "../../redux/store";

export interface Message {
  message: string;
  sender_id: number;
  recipient_id: number;
  created_at: Date;
}

const Chat: React.FC = () => {
  // State
  const [messages, setMessages] = useState<MessageFromDB[]>([]);
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  // Hooks
  const dataState = useSelector<RootState, DataState>((state) => state.data);
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const { socket, selectedUser } = dataState;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current || !userState.data || !selectedUser || !socket)
      return;

    const messageFromDB = await saveMessage({
      message: inputRef.current.value,
      sender_id: userState.data?.user.user_id,
      recipient_id: selectedUser?.user_id,
      created_at: new Date(),
    });

    const message: MessageFromDB = {
      ...messageFromDB.data,
      ...userState.data.user,
    };
    socket.emit("send-message", message);

    dispatch(setMessagesState([...messages, message]));

    inputRef.current.value = "";
  };

  // Get messages matches this chat recipient and sender id
  const getChatMessages = () => {
    if (!userState.data || !dataState.selectedUser) return [];

    const {
      data: { user },
    } = userState;
    const { user_id } = dataState.selectedUser;

    return dataState.messages.filter((message) => {
      return (
        (message.sender_id == user.user_id &&
          message.recipient_id == user_id) ||
        (message.recipient_id == user.user_id && message.sender_id == user_id)
      );
    });
  };

  useEffect(() => {
    if (dataState.selectedUser) {
      const chatMessages = getChatMessages();
      setMessages(chatMessages);
    } else {
      setMessages([]);
    }
  }, [dataState.messages, dataState.selectedUser]);

  // Save message to database
  const saveMessage = async (message: Message) => {
    return await axios.post("/api/messages", {
      senderId: message.sender_id,
      recipientId: message.recipient_id,
      message: message.message,
    });
  };

  return (
    <>
      {dataState.selectedUser ? (
        <Flex direction="column" w="100%" h="100%" bg="white">
          <Flex
            py={3}
            px={5}
            borderBottom="1px"
            borderColor="gray.300"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="lg" fontWeight="400" mr={3}>
              {selectedUser?.full_name}
            </Heading>
            <Tooltip label="Close">
              <CloseIcon
                role="button"
                onClick={() => dispatch(setSelectedUser(null))}
              />
            </Tooltip>
          </Flex>
          <Flex direction="column" flex={1} p={3}>
            {messages.map((message, index) => (
              <Message
                key={index}
                photoUrl={
                  message.photo_url === null ? undefined : message.photo_url
                }
                name={message.full_name}
                message={message.message}
                color={
                  message.user_id === userState.data?.user.user_id
                    ? "blue"
                    : "white"
                }
                boxAlign={
                  message.user_id === userState.data?.user.user_id
                    ? "flex-end"
                    : "flex-start"
                }
                createdAt={message.created_at}
              />
            ))}
          </Flex>
          <form onSubmit={handleSubmit}>
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
                    <button
                      type="submit"
                      style={{ padding: 10, background: "none" }}
                    >
                      <ChatIcon border={0} role="button" />
                    </button>
                  </Tooltip>
                }
              />
            </InputGroup>
          </form>
        </Flex>
      ) : (
        <Center h="100%">
          <Flex direction="column" alignItems="center">
            <Image src={UsersImage} alt="Users Image" height={100} />
            <Heading size="lg" fontWeight="400" color="gray.600">
              No selected user
            </Heading>
          </Flex>
        </Center>
      )}
    </>
  );
};

export default Chat;
