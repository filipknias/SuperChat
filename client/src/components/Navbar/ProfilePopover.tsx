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
// Types
import { RootState } from "../../redux/store";
import { UserState } from "../../redux/reducers/userReducer";

const ProfilePopover: React.FC = () => {
  // Hooks
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  interface UserAvatarProps {
    name: string | undefined;
    photoUrl: string | null | undefined;
    cursor: "default" | "pointer";
  }

  const UserAvatar: React.FC<UserAvatarProps> = ({
    name,
    photoUrl,
    cursor,
  }) => {
    if (photoUrl === null) {
      return <Avatar name={name} cursor={cursor} />;
    } else {
      return <Avatar name={name} src={photoUrl} cursor={cursor} />;
    }
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <a>
          <UserAvatar
            name={userState.data?.user.full_name}
            photoUrl={userState.data?.user.photo_url}
            cursor="pointer"
          />
        </a>
      </PopoverTrigger>
      <PopoverContent color="black">
        <PopoverBody>
          <Flex alignItems="center">
            <UserAvatar
              name={userState.data?.user.full_name}
              photoUrl={userState.data?.user.photo_url}
              cursor="default"
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
            onClick={() => dispatch(logoutUser())}
          >
            Logout
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
