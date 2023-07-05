import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Editable,
  EditableTextarea,
  EditablePreview,
  EditableInput,
  Input,
  Box,
  ButtonGroup,
  Flex,
  useDisclosure,
  useEditableControls,
  Stack,
  StackDivider,
  HStack,
  VStack,
  Text,
  Select,
  CloseButton,
  IconButton
} from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import {
  ChatIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  AddIcon,
  DeleteIcon
} from "@chakra-ui/icons";

import { CommentSchema } from "../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../types";
import { ReportOptions } from "../types";
import { getAllActiveCommentsOfType, createNewComment } from "../utils";

interface CommentProps {
  comments: CommentSchema[] | undefined;
  setComment: Function; // TODO: fix type
}

interface ShowCommentModalProps {
  comments: CommentSchema[];
  typeOfComment: CommentType;
  setComments: Function;
  icon; // TODO: add type
  color: Color;
  isEditable: boolean;
}

function ShowCommentModal({
  comments,
  typeOfComment,
  setComments,
  icon,
  color,
  isEditable,
}: ShowCommentModalProps) {
  const { isOpen: isOpenDisplay, onOpen: onOpenDisplay, onClose: onCloseDisplay } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const user = useContext(UserContext);

  const EditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    // TODO: change this later to reflect figma
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button leftIcon={<CheckIcon />} {...getSubmitButtonProps()} />
        <Button leftIcon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="right">
        <Button size="sm" leftIcon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  };

  const saveEditedComment = (prevComment: CommentSchema, newComment: CommentSchema) => {
    // previous comment edited over so set it to deleted
    prevComment.State = CellStatus.Deleted
    setComments(getAllActiveCommentsOfType(typeOfComment, [...comments, newComment]));
    // TODO: save to DB
  };

  const deleteComment = (comment: CommentSchema) => {
    // TODO: add confirmation popup
    comment.State = CellStatus.Deleted
    setComments(getAllActiveCommentsOfType(comment.Type, comments));
    // 1 since after deletion there will be 0 but wont update in here
    if (comments.length === 1) {
      onCloseDisplay()
    }
    // TODO: save to DB
  }

  const doCommentsExist = comments.length > 0

  // no comments so gray it out
  if (doCommentsExist === false) {
    color = Color.Gray
  }

  // TODO: make the editable work as intended later, without the odd preview box and whatever
  // TODO: fix up styling

  const DisplayCommentsModal = () => {

    return (
      <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>View {typeOfComment}</Text>  
              <Button onClick={onOpenAdd}>
                New
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {comments.map(
              (comment) => (
                <HStack>
                  {/* add UserDisplay card*/}
                  <Editable
                  isDisabled={!isEditable}
                  defaultValue={comment.Content}
                  onSubmit={(value) => saveEditedComment(comment, createNewComment(user, typeOfComment, value))}
                >
                  <EditablePreview />

                  {isEditable && (
                    <>
                      <Input as={EditableInput} />
                      <HStack>
                        <EditableControls />
                        <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => deleteComment(comment)}/>
                      </HStack>
                    </>
                  )}
                </Editable>
                 
                </HStack>
              ))}
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  const AddReportModal = () => {
    const [remark, setRemark] = useState<ReportOptions>(ReportOptions.Late);
    const user = useContext(UserContext);

    
    const handleRemarkChange = (e) => {
      setRemark(e.target.value);
    };

    const handleSubmit = () => {
      if (comments.filter(comment => comment.Content === remark).length === 0) {
        setComments([...comments, createNewComment(user, typeOfComment, remark)]);
      }

      alert(`Your ${typeOfComment} has been submitted!`);
      onCloseAdd()
      // TODO: call to db
    };

    return (
        <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
          <ModalContent>
            <VStack spacing={4} divider={<StackDivider />}>
              <ModalHeader>{typeOfComment}</ModalHeader>

              <FormControl onSubmit={handleSubmit}>
                <HStack spacing={4}>
                  <FormLabel htmlFor="reports">Reports</FormLabel>
                  <Select placeholder={ReportOptions.Late} onChange={handleRemarkChange}>
                    <option value={ReportOptions.LeftEarly}>{ReportOptions.LeftEarly}</option>
                    <option value={ReportOptions.Absent}>{ReportOptions.Absent}</option>
                  </Select>
                </HStack>
              </FormControl>

              <ModalFooter>
                <HStack spacing={10}>
                  <Button onClick={onCloseAdd}>Close</Button>
                  <Button type="submit" onClick={handleSubmit}>
                    Submit
                  </Button>
                </HStack>
              </ModalFooter>
            </VStack>
          </ModalContent>
        </Modal>
    )
  }

  const AddCommentModal = () => {
    const [remark, setRemark] = useState();
    const user = useContext(UserContext);

    const handleRemarkChange = (e) => {
      setRemark(e.target.value);
    };

    const handleSubmit = () => {
      // TODO: reuse comment validation
      setComments([...comments, createNewComment(user, typeOfComment, remark)]);
      alert(`Your ${typeOfComment} has been submitted!`);
      onCloseAdd()
      // TODO: call to db
    };

    return (
        <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
          <ModalContent>
            <VStack spacing={4} divider={<StackDivider />}>
              <ModalHeader>{typeOfComment}</ModalHeader>

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
                  <Button onClick={onCloseAdd}>Close</Button>
                  <Button type="submit" onClick={handleSubmit}>
                    Submit
                  </Button>
                </HStack>
              </ModalFooter>
            </VStack>
          </ModalContent>
        </Modal>
    )
  }

  return (
    <>
    <Box color={color}>
    {doCommentsExist ?
      <>
        <Button
          colorScheme={color}
          aria-label="Report"
          leftIcon={icon}
          onClick={onOpenDisplay} >
            {comments.length}
        </Button>
        {isEditable && 
          <Button
            colorScheme={color}
            aria-label="Add Feedback"
            leftIcon={<AddIcon />}
            onClick={onOpenAdd} />
        }
        </> : 
        <>
        {isEditable && <Button
          colorScheme={color}
          aria-label="Report"
          leftIcon={icon}
          onClick={onOpenAdd}>
            <AddIcon />
          </Button>}
        </>
        }
    </Box>
      <DisplayCommentsModal />
      {typeOfComment === CommentType.Comment ? 
      <AddCommentModal />
      : <AddReportModal />}
      
    </>
  );
}

export function CommentCell(props: CommentProps) {
  const [comments, setComments] = useState(
    getAllActiveCommentsOfType(CommentType.Comment, props.comments)
  );
  const [reports, setReports] = useState(
    getAllActiveCommentsOfType(CommentType.Report, props.comments)
  );
  const [isEditable, setisEditable] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    //Supervisor/Admins have the right to edit comments/reports
    if (user?.Type === "Supervisor" || user?.Type === "Admin") {
      setisEditable(true);
    }
  }, [user?.Type]);

  return (
    <Stack direction='row'>
      <ShowCommentModal
        setComments={setReports}
        comments={reports}
        typeOfComment={CommentType.Report}
        icon={<WarningIcon />}
        color={Color.Red}
        isEditable={isEditable}
      />
      <ShowCommentModal
          setComments={setComments}
          comments={comments}
          typeOfComment={CommentType.Comment}
          icon={<ChatIcon />}
          color={Color.Blue}
          isEditable={isEditable}
        />
    </Stack>
  );
}