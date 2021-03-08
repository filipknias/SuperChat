import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { debounce } from "lodash";
// Chakra UI
import {
  Input,
  PopoverContent,
  PopoverBody,
  Popover,
  PopoverTrigger,
  Button,
  Avatar,
  Heading,
} from "@chakra-ui/react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../../redux/actions/dataActions";
// Types
import { UserData, UserState } from "../../redux/reducers/userReducer";
import { RootState } from "../../redux/store";

const SearchBar: React.FC = () => {
  // State
  const [open, setOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [popoverWidth, setPopoverWidth] = useState<number>(0);
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  // Hooks
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  const searchPeople = async (name: string) => {
    const results = await axios.get(`/api/users?fullName=${name}`);
    setSearchResults(results.data);
    setOpen(true);
  };

  const debounceFunction = useRef(debounce(searchPeople, 1200));

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      await debounceFunction.current(e.target.value);
    } else {
      debounceFunction.current.cancel();
    }
  };

  const handleInputClick = async () => {
    if (inputRef.current && inputRef.current.value !== "") {
      await debounceFunction.current(inputRef.current.value);
    }
  };

  const handleUserClick = (userData: UserData) => {
    setOpen(false);
    dispatch(setSelectedUser(userData));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const updatePopoverWidth = () => {
    if (!inputRef.current) return;
    setPopoverWidth(inputRef.current?.offsetWidth);
  };

  // Update popover width on window resize
  useEffect(() => {
    updatePopoverWidth();
    window.addEventListener("resize", updatePopoverWidth);
  }, []);

  // Search results validation
  useEffect(() => {
    // Prevent searching yourself
    const validSearchResults = searchResults.filter((searchResult) => {
      return searchResult.user_id !== userState.data?.user.user_id;
    });
    if (validSearchResults.length !== searchResults.length) {
      setSearchResults(validSearchResults);
    }
  }, [searchResults]);

  // TODO: on input click add recent users
  return (
    <Popover
      isOpen={open}
      onClose={() => setOpen(false)}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Input
          type="text"
          bg="white"
          color="black"
          pr={"10px"}
          placeholder="Chat with people"
          onChange={handleChange}
          onClick={handleInputClick}
          ref={inputRef}
        />
      </PopoverTrigger>
      <PopoverContent color="black" w={popoverWidth}>
        <PopoverBody>
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((userData) => (
                <Button
                  key={userData.user_id}
                  colorScheme="teal"
                  variant="ghost"
                  w="100%"
                  py={10}
                  leftIcon={
                    <Avatar
                      src={userData.photo_url || undefined}
                      name={userData.full_name}
                    />
                  }
                  justifyContent="flex-start"
                  onClick={() => handleUserClick(userData)}
                >
                  {userData.full_name}
                </Button>
              ))}
            </>
          ) : (
            <Heading size="sm" fontWeight="400" textAlign="center" my={3}>
              No Results
            </Heading>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
