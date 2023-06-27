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
  CloseButton,
  IconButton
} from "@chakra-ui/react";
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
import { DailyCommentModal } from "../CommentModal";
import { getAllActiveCommentsOfType, createNewComment } from "../utils";

interface CommentProps {
  comments: CommentSchema[] | undefined;
  setComment: Function; // TODO: fix type
}

function ShowReportModal(){

  return (
    <></>
  )
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

  const elevatedUserPrivileges =
    user?.Type === "Supervisor" || user?.Type === "Admin";

  const saveComment = (comment: CommentSchema) => {
    // Do we want people to be able to delete comments by saving empty comments?
    comment.State = CellStatus.Deleted
    setComments(getAllActiveCommentsOfType(typeOfComment, comments));
    // TODO: save to DB
  };

  const deleteComment = (comment: CommentSchema) => {
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
  // TODO: also display multiple comments, fix up styling

  const DisplayCommentsModal = () => {
    // TODO: make it match figma
    return (
      <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>View Comments</Text>  
              <Button onClick={onOpenAdd}>
                New
              </Button>
              <CloseButton onClick={onCloseDisplay} />
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {comments.map(
              (comment) => (
                <HStack>
                  {/* add UserDisplay card*/}
                  <Text>{comment.Content}</Text>
                  <IconButton aria-label="Edit" icon={<EditIcon />}/>
                  <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => deleteComment(comment)}/>
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
      setComments([...comments, createNewComment(user, typeOfComment, remark)]);
      alert(`Your ${typeOfComment} has been submitted!`);
      onCloseAdd()
      onCloseDisplay()
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
          <Button
          colorScheme={color}
          aria-label="Report"
          leftIcon={icon}
          onClick={onOpenAdd}>
            <AddIcon />
          </Button>
        </>
        }
    </Box>
      <DisplayCommentsModal />
      <AddCommentModal />
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