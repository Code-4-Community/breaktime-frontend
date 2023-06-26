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
  IconButton,
  ButtonGroup,
  Flex,
  useDisclosure,
  useEditableControls,
  Stack,
} from "@chakra-ui/react";
import {
  ChatIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
} from "@chakra-ui/icons";

import { CommentSchema } from "../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../types";
import { DailyCommentModal } from "../CommentModal";
import { getAllActiveCommentsOfType, createNewComment } from "../utils";

interface CommentProps {
  comments: CommentSchema[] | undefined;
  setComment: Function; // TODO: fix type
}

// setComments can be used for comments or reports
interface ShowCommentModalProps {
  comments: CommentSchema[];
  currentComment: CommentSchema;
  setComments: Function;
  icon; // TODO: add type
  color: Color;
  isEditable: boolean;
}

function ShowCommentModal({
  comments,
  currentComment,
  setComments,
  icon,
  color,
  isEditable,
}: ShowCommentModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [displayedComment, setDisplayedComment] = useState(
    currentComment
  );
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

  // TODO: probably need to add some more validation
  const addNewComment = (value: string) => {
    if (value !== "") {
      setDisplayedComment(createNewComment(user, displayedComment.Type, value));
    }
  };

  const saveComment = () => {
    // Do we want people to be able to delete comments by saving empty comments?
    currentComment.State = CellStatus.Deleted
    setComments(getAllActiveCommentsOfType(displayedComment.Type, [...comments, displayedComment]));
    // TODO: save to DB
  };

  const deleteComment = () => {
    currentComment.State = CellStatus.Deleted
    setComments(getAllActiveCommentsOfType(currentComment.Type, comments));
    // TODO: save to DB
  }

  // TODO: make the editable work as intended later, without the odd preview box and whatever
  // TODO: also display multiple comments
  return (
    <>
      <IconButton
        colorScheme={color}
        aria-label="Report"
        icon={icon}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{displayedComment.Type}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Editable
              isDisabled={!isEditable}
              defaultValue={displayedComment.Content}
              onSubmit={(value) => addNewComment(value)}
            >
              <Input as={EditableInput} />
              <EditablePreview />

              {elevatedUserPrivileges && (
                <>
                  <EditableTextarea />
                  <EditableControls />
                </>
              )}
            </Editable>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={Color.Blue} mr={3} onClick={onClose}>
              Close
            </Button>
            {isEditable && elevatedUserPrivileges && 
            <>
              <Button colorScheme={Color.Red} mr={3} onClick={deleteComment}>
                Delete
              </Button>
              <Button colorScheme={Color.Green} mr={3} onClick={saveComment}>
                Save
              </Button>
            </>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      {reports.length > 0 ? (
        <ShowCommentModal
          setComments={setReports}
          comments={reports}
          currentComment={reports[reports.length - 1]}
          icon={<WarningIcon />}
          color={Color.Red}
          isEditable={isEditable}
        />
      ) : (
        <DailyCommentModal
          setComments={setReports}
          comments={reports}
          type={CommentType.Report}
        />
      )}
      {comments.length > 0 ? (
        <ShowCommentModal
          setComments={setComments}
          comments={comments}
          currentComment={comments[comments.length - 1]}
          icon={<ChatIcon />}
          color={Color.Blue}
          isEditable={isEditable}
        />
      ) : (
        <DailyCommentModal
          setComments={setComments}
          comments={comments}
          type={CommentType.Comment}
        />
      )}
    </Stack>
  );
}

// TODO: merge components