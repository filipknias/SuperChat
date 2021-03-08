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
  CircularProgress,
  Image,
} from "@chakra-ui/react";
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../../redux/actions/dataActions";
// Types
import { UserState, UserData } from "../../redux/reducers/userReducer";
import { DataState } from "../../redux/reducers/dataReducer";
import { RootState } from "../../redux/store";

export interface Message {
  message: string;
  sender_user: UserData;
  recipient_id: number;
  created_at: Date;
}

interface MessageFromDB extends UserData {
  message_id: number;
  message: string;
  sender_id: number;
  recipient_id: number;
  created_at: Date;
}

const Chat: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

    const message = {
      message: inputRef.current.value,
      sender_user: userState.data?.user,
      recipient_id: selectedUser?.user_id,
      created_at: new Date(),
    };
    socket.emit("send-message", message);

    setMessages((messages) => [...messages, message]);

    await saveMessage(message);

    inputRef.current.value = "";
  };

  // Handle socket events
  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("receive-message", async (message: Message) => {
      if (message.sender_user.user_id === selectedUser?.user_id) {
        setMessages((messages) => [...messages, message]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, selectedUser]);

  // Fetch messages from database
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const chatMessages = await axios.get(
        `/api/messages?senderId=${userState.data?.user.user_id}&recipientId=${selectedUser?.user_id}`
      );

      const formattedMessages = chatMessages.data.map(
        (message: MessageFromDB) => {
          const userData: UserData = {
            user_id: message.user_id,
            first_name: message.first_name,
            last_name: message.last_name,
            full_name: message.full_name,
            email: message.email,
            password: message.password,
            created_at: message.created_at,
            photo_url: message.photo_url,
          };
          return {
            message: message.message,
            sender_user: userData,
            recipient_id: message.recipient_id,
            created_at: message.created_at,
          };
        }
      );

      setMessages(formattedMessages);
      setLoading(false);
    };
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  // Save message to database
  const saveMessage = async (message: Message) => {
    await axios.post("/api/messages", {
      senderId: message.sender_user.user_id,
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
            {loading ? (
              <Center h="100%" w="100%">
                <CircularProgress color="blue.600" isIndeterminate />
              </Center>
            ) : (
              <>
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
                      message.sender_user.user_id ===
                      userState.data?.user.user_id
                        ? "blue"
                        : "white"
                    }
                    boxAlign={
                      message.sender_user.user_id ===
                      userState.data?.user.user_id
                        ? "flex-end"
                        : "flex-start"
                    }
                    createdAt={message.created_at}
                  />
                ))}
              </>
            )}
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
