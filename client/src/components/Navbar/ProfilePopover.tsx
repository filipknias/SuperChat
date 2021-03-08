import React from "react";
// Chakra UI
import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Heading,
  Flex,
  Button,
  VStack,
  Divider,
} from "@chakra-ui/react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import { setSelectedUser } from "../../redux/actions/dataActions";
// Types
import { RootState } from "../../redux/store";
import { UserState } from "../../redux/reducers/userReducer";

const ProfilePopover: React.FC = () => {
  // Hooks
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setSelectedUser(null));
    dispatch(logoutUser());
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <a>
          <Avatar
            name={userState.data?.user.full_name}
            photourl={userState.data?.user.photo_url || undefined}
            cursor="pointer"
          />
        </a>
      </PopoverTrigger>
      <PopoverContent color="black">
        <PopoverBody>
          <Flex alignItems="center">
            <Avatar
              name={userState.data?.user.full_name}
              photourl={userState.data?.user.photo_url || undefined}
            />
            <VStack ml={3} alignItems="flex-start">
              <Heading size="md">{userState.data?.user.full_name}</Heading>
              <Heading size="sm" fontWeight="400">
                {userState.data?.user.email}
              </Heading>
            </VStack>
          </Flex>
          <Divider orientation="horizontal" mt={4} />
          <Button
            colorScheme="blue"
            variant="ghost"
            w="100%"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
