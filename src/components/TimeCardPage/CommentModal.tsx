import {
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  VStack,
  StackDivider,
  ModalFooter,
  HStack,
  Center,
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { CommentType } from "./types";
import { CommentSchema } from "src/schemas/RowSchema";
import { createNewComment } from "./CellTypes/CommentCell";
import { UserContext } from "./UserContext";

// setComments can be used for comments or reports
interface DailyCommentModalProps {
  setComments: Function;
  comments: CommentSchema[];
  type: CommentType;
}

export default function DailyCommentModal({
  setComments,
  comments,
  type,
}: DailyCommentModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remark, setRemark] = useState();
  const user = useContext(UserContext);

  // stores the remark that was made
  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleSubmit = () => {
    setComments([...comments, createNewComment(user, type, remark)]);
    // TODO: call to db
  };

  return (
    <>
      <Center>
        <Button
          gap={20}
          display="flex"
          onClick={onOpen}
          bg="white"
          color="black"
        >
          Comments/Reports
        </Button>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <VStack spacing={4} divider={<StackDivider />}>
            <ModalHeader>New {type}</ModalHeader>

            <form id="Form" onSubmit={handleSubmit}>
              <HStack spacing={4}>
                <label htmlFor="remarks">Remarks</label>
                <Input
                  id="remarks"
                  name="remarks"
                  type="text"
                  onChange={handleRemarkChange}
                  autoComplete="off"
                />
              </HStack>
            </form>

            <ModalFooter>
              <HStack spacing={10}>
                <Button onClick={onClose}>Close</Button>
                <Button type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </HStack>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
}
