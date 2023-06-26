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
  Select
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { CommentType } from "./types";
import { CommentSchema } from "src/schemas/RowSchema";
import { createNewComment } from "./utils";
import { UserContext } from "./UserContext";

interface WeeklyCommentModalProps {
  setWeeklyComments: Function;
  setWeeklyReports: Function;
  weeklyComments: CommentSchema[];
  weeklyReports: CommentSchema[];
}

export function WeeklyCommentModal({
  setWeeklyComments,
  setWeeklyReports,
  weeklyComments,
  weeklyReports
}: WeeklyCommentModalProps) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState<CommentType>(CommentType.Comment)
  const [remark, setRemark] = useState();
  const user = useContext(UserContext);

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);  
  };

  const handleFormSubmit = () => {
    // TODO: reuse comment validation
    if (type === CommentType.Comment){
      setWeeklyComments([...weeklyComments, createNewComment(user, type, remark)]);
    } else{
      setWeeklyReports([...weeklyReports, createNewComment(user, type, remark)]);
    }
    alert(`Your ${type} has been submitted!`);
    // TODO: call to db
    setType(CommentType.Comment) // so that Comment is consistently first option in drop down
    onClose() // maybe don't autoclose? currently mimicking how daily comment modal closes
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
        Add Weekly Feedback
      </Button>
    </Center>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <VStack spacing={4} divider={<StackDivider />}>
          <ModalHeader>{type}</ModalHeader>

          <form id="Form" onSubmit={handleFormSubmit}>
            <HStack spacing={4}>
              <label htmlFor="remarks">Remarks</label>
              <Input
                id="remarks"
                name="remarks"
                type="text"
                onChange={handleRemarkChange}
                autoComplete="off"
              />
               <label htmlFor="Type">Type</label>
                  <Select onChange={handleTypeChange} defaultValue={type}>
                      <option value='Comment'>{CommentType.Comment}</option>
                      <option value='Report'>{CommentType.Report}</option>
                  </Select>
            </HStack>
          </form>

          <ModalFooter>
            <HStack spacing={10}>
              <Button onClick={onClose}>Close</Button>
              <Button type="submit" onClick={handleFormSubmit}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  </>
  )
};

// setComments can be used for comments or reports
interface DailyCommentModalProps {
  setComments: Function;
  comments: CommentSchema[];
  type: CommentType;
}

export function DailyCommentModal({
  setComments,
  comments,
  type,
}: DailyCommentModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remark, setRemark] = useState();
  const user = useContext(UserContext);

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleSubmit = () => {
    // reuse comment validation
    setComments([...comments, createNewComment(user, type, remark)]);
    alert(`Your ${type} has been submitted!`);
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
          Add {type}
        </Button>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <VStack spacing={4} divider={<StackDivider />}>
            <ModalHeader>{type}</ModalHeader>

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
};