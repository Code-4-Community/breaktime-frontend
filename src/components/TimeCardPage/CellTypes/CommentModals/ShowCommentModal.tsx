import React, { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
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
  EditablePreview,
  EditableInput,
  Input,
  Box,
  ButtonGroup,
  Flex,
  useDisclosure,
  useEditableControls,
  StackDivider,
  HStack,
  VStack,
  Text,
  IconButton,
  Textarea
} from "@chakra-ui/react";

import {
  ChatIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  AddIcon,
  DeleteIcon
} from "@chakra-ui/icons";

import { CommentSchema } from "../../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../../types";
import { getAllActiveCommentsOfType, createNewComment } from "../../utils";

const saveEditedComment = (
  setComments: Function, 
  comments: CommentSchema[], 
  typeOfComment: CommentType, 
  prevComment: CommentSchema, 
  newComment: CommentSchema) => {
  // previous comment edited over so set it to deleted
  prevComment.State = CellStatus.Deleted
  setComments(getAllActiveCommentsOfType(typeOfComment, [...comments, newComment]));
  // TODO: save to DB
};

const deleteComment = (
  onCloseDisplay: Function, 
  setComments: Function, 
  comments: CommentSchema[], 
  typeOfComment: CommentType, 
  comment: CommentSchema) => {
  // TODO: add confirmation popup
  comment.State = CellStatus.Deleted
  setComments(getAllActiveCommentsOfType(typeOfComment, comments));
  if (comments.length === 1) {
    onCloseDisplay()
  }
  // TODO: save to DB
}

interface ShowCommentModalProps {
    comments: CommentSchema[];
    setComments: Function;
    isEditable: boolean;
  }
  
export default function ShowCommentModal({
    comments,
    setComments,
    isEditable,
  }: ShowCommentModalProps) {
    const { isOpen: isOpenDisplay, onOpen: onOpenDisplay, onClose: onCloseDisplay } = useDisclosure();
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
    const user = useContext(UserContext);
    let color = Color.Blue
  
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
  
    const doCommentsExist = comments.length > 0
  
    // no comments so gray it out
    if (doCommentsExist === false) {
      color = Color.Gray
    }
  
    const DisplayCommentsModal = () => {
  
      return (
        <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Text>View {CommentType.Comment}</Text>
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
                    {/* add UserDisplay card once pr merged in*/}
                    <Editable
                      isDisabled={!isEditable}
                      defaultValue={comment.Content}
                      onSubmit={(value) => saveEditedComment(setComments, comments, CommentType.Comment, comment, createNewComment(user, CommentType.Comment, value))}
                    >
                      <EditablePreview />
  
                      {isEditable && (
                        <>
                          <Input as={EditableInput} />
                          <HStack>
                            <EditableControls />
                            <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => deleteComment(onCloseDisplay, setComments, comments, CommentType.Comment, comment)} />
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
  
    const AddCommentModal = () => {
      const [remark, setRemark] = useState();
      const user = useContext(UserContext);
  
      const handleRemarkChange = (e) => {
        setRemark(e.target.value);
      };
  
      const handleSubmit = () => {
        // TODO: reuse comment validation
        setComments([...comments, createNewComment(user, CommentType.Comment, remark)]);
        // show a toast that its been submitted
        onCloseAdd()
        // TODO: call to db
      };
  
      return (
        <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
          <ModalContent>
            <VStack spacing={4} divider={<StackDivider />}>
              <ModalHeader>{CommentType.Comment}</ModalHeader>
  
              <form id="Form" onSubmit={handleSubmit}>
                <HStack spacing={4}>
                  <label htmlFor="remarks">Remarks</label>
                  <Textarea
                    id="remarks"
                    name="remarks"
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
                leftIcon={<ChatIcon />}
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
                leftIcon={<ChatIcon />}
                onClick={onOpenAdd}>
                <AddIcon />
              </Button>}
            </>
          }
        </Box>
        <DisplayCommentsModal />
        <AddCommentModal />
      </>
    );
  }