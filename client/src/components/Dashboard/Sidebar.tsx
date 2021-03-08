import React, { useState, useEffect } from "react";
import axios from "axios";
// Chakra UI
import {
  Tooltip,
  Center,
  Button,
  Avatar,
  Box,
  CircularProgress,
} from "@chakra-ui/react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../../redux/actions/dataActions";
// Types
import { UserState, UserData } from "../../redux/reducers/userReducer";
import { DataState } from "../../redux/reducers/dataReducer";
import { RootState } from "../../redux/store";

const Sidebar: React.FC = () => {
  // State
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // Hooks
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dataState = useSelector<RootState, DataState>((state) => state.data);
  const dispatch = useDispatch();

  // Fetch users
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const usersMessages = await axios.get(
        `/api/messages/${userState.data?.user.user_id}`
      );
      setUsers(usersMessages.data);
      setLoading(false);
    };
    if (userState.auth) {
      fetchMessages();
    }
  }, [userState.data]);

  return (
    <Box h="100%" mr={5}>
      {loading ? (
        <Center w="100%" h="100%">
          <CircularProgress color="blue.600" isIndeterminate />
        </Center>
      ) : (
        <>
          {users.map((userData) => (
            <Tooltip label={userData.full_name} key={userData.user_id}>
              <Button
                colorScheme="teal"
                variant={
                  userData.user_id === dataState.selectedUser?.user_id
                    ? "solid"
                    : "ghost"
                }
                py={10}
                w="100%"
                onClick={() => dispatch(setSelectedUser(userData))}
              >
                <Avatar
                  src={userData.photo_url || undefined}
                  name={userData.full_name}
                  size="md"
                />
              </Button>
            </Tooltip>
          ))}
        </>
      )}
    </Box>
  );
};

export default Sidebar;
