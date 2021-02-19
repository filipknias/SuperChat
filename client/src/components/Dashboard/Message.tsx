import React from "react";
import dayjs from "dayjs";
// Chakra UI
import { Box, Flex, Avatar, Tooltip } from "@chakra-ui/react";

interface Props {
  name: string;
  photoUrl: string | undefined;
  message: string;
  createdAt: Date;
  color: "blue" | "white";
  boxAlign: "flex-start" | "flex-end";
}

const Message: React.FC<Props> = ({
  name,
  photoUrl,
  message,
  createdAt,
  color,
  boxAlign,
}) => {
  return (
    <div style={{ alignSelf: boxAlign }}>
      <Flex alignItems="center" my={2}>
        <Tooltip label={name}>
          <Avatar src={photoUrl} name={name} mr={2} />
        </Tooltip>
        <Tooltip label={dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}>
          <Box
            bg={color}
            color={color === "blue" ? "white" : "black"}
            borderRadius={5}
            border="1px"
            p={2}
          >
            {message}
          </Box>
        </Tooltip>
      </Flex>
    </div>
  );
};

export default Message;
