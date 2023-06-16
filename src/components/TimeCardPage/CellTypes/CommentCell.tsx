import React, {useState, useEffect, useContext} from 'react'; 
import {Button} from '@chakra-ui/react';
import { UserContext } from '../UserContext';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    IconButton,
    ButtonGroup,
    Flex,
    useDisclosure,
    useEditableControls
  } from '@chakra-ui/react';
import {
    ChatIcon,
    WarningIcon,
    CheckIcon,
    CloseIcon,
    EditIcon
  } from '@chakra-ui/icons';
import {
  Editable,
  EditableTextarea,
  EditablePreview,
  EditableInput
  } from '@chakra-ui/react';

import {CommentSchema} from '../../../schemas/RowSchema'; 
import {CommentType, CellStatus} from '../types'; 
import CommentModal from '../CommentModal'

interface CommentProps {
    comments: CommentSchema[] | undefined; 
    setComment: Function; 
} 


// setComments can be used for comments or reports
interface ShowCommentModalProps{
    comments: CommentSchema[];
    setComments: Function;
    icon;
    color: string;
    editable: boolean;
}

export const createNewComment = (type: CommentType, content: string) => {
    return {
      AuthorID:"david", 
      Type: type, 
      Timestamp: 1312313, 
      Content: content, 
      State: CellStatus.Active
    }
}

function ShowCommentModal(props:ShowCommentModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [comment, setComment] = useState(props.comments[props.comments.length - 1]);
    const user = useContext(UserContext);

    const EditableControls = () => {
      const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
      } = useEditableControls()
      
      // change this later to reflect figma
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
        setComment(createNewComment(comment.Type, value))
      }
    }

    const saveComment = () => {
      props.setComments([...props.comments, comment])
      // save to DB
    }

    // make the editable work as intended later, without the odd preview box and whatever
    return (
      <>
        <IconButton colorScheme={props.color} aria-label='Report' icon={props.icon} onClick={onOpen} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{comment.Type}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Editable isDisabled={!props.editable} defaultValue={comment.Content} onSubmit={(value) => addNewComment(value)}>
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
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              {props.editable && elevatedUserPrivileges && <Button colorScheme='green' onClick={saveComment}>Save</Button>}
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
    const [editable, setEditable] = useState(false);
    const user = useContext(UserContext);

    //TODO - Eventually refactor to handle multiple comments / process for grabbing user 
    useEffect(() => {
        // If empty, create stubbed empty one to leave our comments at - eventually refactor to just add this to the end as the current users comments?
        /*if (props.comments === undefined) {
            //Create one empty comment 
            setComments([{
                AuthorID:"<TODO Fill this in at some point>", 
                Type: CommentType.Comment, 
                Timestamp: moment().tz(TIMEZONE).unix(), 
                Content:"",
                State: CellStatus.Active 
            }]); 
        }*/
        //Supervisor/Admins have the right to edit comments/reports
        if (user.Type === "Supervisor" || user.Type === "Admin") {
          setEditable(true);
        } 
    }, []);  

    if (comments !== undefined || reports !== undefined) {
        return (
            <>
                {reports.length > 0  ? 
                  <ShowCommentModal setComments={setReports} comments={reports} icon={<WarningIcon />} color={"red"} editable={editable} /> :
                  <CommentModal setComments={setReports} comments={reports} type={CommentType.Report} />}
                {comments.length > 0 ? 
                  <ShowCommentModal setComments={setComments} comments={comments} icon={<ChatIcon />} color={"blue"} editable={editable} /> :
                  <CommentModal setComments={setComments} comments={comments} type={CommentType.Comment}/>}
            </>
        )
    } else {
        // if editable is true, then the user is an supervisor or admin and should be able to add reports/comments as well
        return (
          <>
            {editable &&
              <>
                <CommentModal setComments={setReports} comments={reports} type={CommentType.Report} />
                <CommentModal setComments={setComments} comments={comments} type={CommentType.Comment} />
              </>}
          </>
        )
    }

}

// TODO: modify current comment modal to add for weekly or daily
// TODO: add delete functionality