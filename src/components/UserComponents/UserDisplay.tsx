import React from "react";
import { UserSchema } from "../../schemas/UserSchema";
import { SizeType } from "../../constants";
import { Card, CardBody, Avatar, Text } from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

interface AuthorProps {
  user: UserSchema;
  size: SizeType;
}

// Renders a specific users information in various sizes
export function AuthorComponent({ user, size }: AuthorProps) {
  //TODO: loading/error handling
  if (user === undefined) {
    return <></>;
  }

  const fullName = user.FirstName + " " + user.LastName;

  const avatar = (
    <Avatar
      src={user.Picture}
      name={fullName}
      size={size}
      showBorder={true}
      borderColor="black"
      borderWidth="thick"
    />
  );

  if (size === SizeType.small) {
    return (
      <Popover trigger="hover">
        <PopoverTrigger>{avatar}</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{fullName}</PopoverBody>
        </PopoverContent>
      </Popover>
    );
  } else {
    // medium case + large case
    return (
      <Card width="50%">
        {avatar}
        <CardBody>
          <Text>{fullName}</Text>
          {size === SizeType.large && <Text>{user.Email}</Text>}
        </CardBody>
      </Card>
    );
  }
}
