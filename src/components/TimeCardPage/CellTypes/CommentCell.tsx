import React, {useState, useEffect, useContext} from 'react'; 
import { UserContext } from '../UserContext';
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
  } from '@chakra-ui/react';
import {
    ChatIcon,
    WarningIcon,
    CheckIcon,
    CloseIcon,
    EditIcon
  } from '@chakra-ui/icons';


import {CommentSchema} from '../../../schemas/RowSchema'; 
import { UserSchema } from 'src/schemas/UserSchema';
import {CommentType, CellStatus, Color} from '../types'; 
import CommentModal from '../CommentModal'
import moment from 'moment-timezone';

interface CommentProps {
    comments: CommentSchema[] | undefined; 
    setComment: Function; // TODO: fix type 
} 


// setComments can be used for comments or reports
interface ShowCommentModalProps{
    comments: CommentSchema[];
    setComments: Function;
    icon; // TODO: add type
    color: Color;
    isEditable: boolean;
}

export const createNewComment = (user: UserSchema, type: CommentType, content: string) => {
    return {
      AuthorID: user.UserID, 
      Type: type, 
      Timestamp: moment().unix(), // TODO: possibly change it to be more specific formatting
      Content: content, 
      State: CellStatus.Active
    }
}

function ShowCommentModal({
  comments,
  setComments,
  icon,
  color,
  isEditable
}: ShowCommentModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [displayedComment, setDisplayedComment] = useState(comments[comments.length - 1]);
    const user = useContext(UserContext);

    const EditableControls = () => {
      const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
      } = useEditableControls()
      
      // TODO: change this later to reflect figma
      return isEditing ? (
        <ButtonGroup justifyContent='center' size='sm'>
          <Button leftIcon={<CheckIcon />} {...getSubmitButtonProps()} />
          <Button leftIcon={<CloseIcon />} {...getCancelButtonProps()} />
        </ButtonGroup>
      ) : (
        <Flex justifyContent='right'>
          <Button size='sm' leftIcon={<EditIcon />} {...getEditButtonProps()} />
        </Flex>
      )
    }

    const elevatedUserPrivileges = (user.Type === "Supervisor" || user.Type === "Admin")

    // probably need to add some more validation
    const addNewComment = (value: string) => {
      if (value !== ""){
        setDisplayedComment(createNewComment(user, displayedComment.Type, value))
      }
    }

    const saveComment = () => {
      setComments([...comments, displayedComment])
      // TODO: save to DB
    }

    // make the editable work as intended later, without the odd preview box and whatever
    return (
      <>
        <IconButton colorScheme={color} aria-label='Report' icon={icon} onClick={onOpen} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{displayedComment.Type}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Editable isDisabled={!isEditable} defaultValue={displayedComment.Content} onSubmit={(value) => addNewComment(value)}>
                  <Input as={EditableInput} />
                  <EditablePreview />
                  {elevatedUserPrivileges && 
                  <>
                  <EditableTextarea />
                  <EditableControls />
                  </>}
                </Editable> 
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme={Color.Blue} mr={3} onClick={onClose}>
                Close
              </Button>
              {isEditable && elevatedUserPrivileges && <Button colorScheme={Color.Green} onClick={saveComment}>Save</Button>}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

const getAllCommentsOfType = (type, commentArray) => {
    if (commentArray === undefined) {
        return []
    } else {
        return commentArray.filter(comment => (comment.Type === type));
    }
}

export function CommentCell(props:CommentProps) {

    const [comments, setComments] = useState(getAllCommentsOfType(CommentType.Comment, props.comments));
    const [reports, setReports] = useState(getAllCommentsOfType(CommentType.Report, props.comments));
    const [isEditable, setisEditable] = useState(false);
    const user = useContext(UserContext);

    useEffect(() => {
        //Supervisor/Admins have the right to edit comments/reports
        if (user.Type === "Supervisor" || user.Type === "Admin") {
          setisEditable(true);
        } 
    }, [user.Type]);  

    return (
        <>
            {reports.length > 0  ? 
              <ShowCommentModal setComments={setReports} comments={reports} icon={<WarningIcon />} color={Color.Red} isEditable={isEditable} /> :
              <CommentModal setComments={setReports} comments={reports} type={CommentType.Report} />}
            {comments.length > 0 ? 
              <ShowCommentModal setComments={setComments} comments={comments} icon={<ChatIcon />} color={Color.Blue} isEditable={isEditable} /> :
              <CommentModal setComments={setComments} comments={comments} type={CommentType.Comment}/>}
        </>
    )

}

// TODO: modify current comment modal to add for weekly or daily
// TODO: add delete functionality