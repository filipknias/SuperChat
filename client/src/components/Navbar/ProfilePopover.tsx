import React from "react";
// Chakra UI
import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Heading,
} from "@chakra-ui/react";

const ProfilePopover: React.FC = () => {
  const expampleUser = "John Doe";

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Avatar cursor="pointer" name={expampleUser} />
      </PopoverTrigger>
      <PopoverContent color="black">
        <PopoverHeader>
          <Heading size="md" textAlign="center">
            {expampleUser}
          </Heading>
        </PopoverHeader>
        <PopoverBody>This is popover.</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
