import React, { useState, useEffect } from "react";
// Chakra UI
import { Tooltip, Button, Avatar, Box, Flex, Heading } from "@chakra-ui/react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../../redux/actions/dataActions";
// Types
import { UserState } from "../../redux/reducers/userReducer";
import { DataState, SenderUser } from "../../redux/reducers/dataReducer";
import { RootState } from "../../redux/store";

const Sidebar: React.FC = () => {
  // State
  const [users, setUsers] = useState<SenderUser[]>([]);
  // Hooks
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dataState = useSelector<RootState, DataState>((state) => state.data);
  const dispatch = useDispatch();

  // Remove duplicates from array
  const removeDuplicates = (originalArray: Array<any>, prop: string) => {
    const newArray: any = [];
    const lookupObject: any = {};

    for (let i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  };

  // Set users
  useEffect(() => {
    const formattedArray: SenderUser[] = removeDuplicates(
      dataState.messages,
      "user_id"
    );
    const filteredArray = formattedArray.filter((user) => {
      return user.user_id !== userState.data?.user.user_id;
    });
    setUsers(filteredArray);
  }, [dataState.messages]);

  return (
    <Box
      h={{ md: "100%" }}
      mr={{ base: 2, md: 5 }}
      mb={{ base: 3, md: 0 }}
      overflowX={{ base: "scroll", md: "auto" }}
      overflowY={{ md: "scroll" }}
    >
      <Flex direction={{ base: "row", md: "column" }}>
        {users.map((userData) => (
          <Tooltip label={userData.full_name} key={userData.user_id}>
            <Button
              minW="200px"
              colorScheme="teal"
              variant={
                userData.user_id === dataState.selectedUser?.user_id
                  ? "solid"
                  : "ghost"
              }
              py={6}
              w="100%"
              onClick={() => dispatch(setSelectedUser(userData))}
            >
              <Avatar
                src={userData.photo_url || undefined}
                name={userData.full_name}
                size="sm"
                mr={3}
              />
              <Heading size="sm" fontWeight="500">
                {userData.full_name}
              </Heading>
            </Button>
          </Tooltip>
        ))}
      </Flex>
    </Box>
  );
};

export default Sidebar;
