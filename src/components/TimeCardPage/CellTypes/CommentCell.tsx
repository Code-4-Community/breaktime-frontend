import moment from 'moment-timezone';
import React, {useState, useEffect, } from 'react'; 
import {Button, ChakraComponent} from '@chakra-ui/react';
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
import {TIMEZONE} from '../../../constants'; 
import { UserSchema } from 'src/schemas/UserSchema';

interface CommentProps {
    comments: CommentSchema[] | undefined; 
    setComment: Function; 
    user: UserSchema;
} 

interface ShowCommentModalProps{
    comments: CommentSchema[];
    setComments: Function;
    icon;
    color: string;
    editable: boolean;
}

const createNewComment = (type: CommentType, content: string) => {
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

    const EditableControls = () => {
      const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps,
      } = useEditableControls()
      
      // change this later
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
                <Editable isDisabled={!props.editable} defaultValue={comment.Content} onSubmit={(value) => setComment(createNewComment(comment.Type, value))}>
                  <Input as={EditableInput} />
                  <EditablePreview />
                  <EditableTextarea />
                  <EditableControls />
                </Editable> 
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              {/* add in api call*/}
              {props.editable && <Button colorScheme='green' onClick={() => {props.setComments(...props.comments, comment); console.log("save to Db and show user it was saved", comment);}}>Save</Button>}
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
        if (props.user.Type === "Supervisor" || props.user.Type === "Admin") {
          setEditable(true);
        } 
    }, []);  

    // make sure to change
    const onUpdate = (event) => {
        comments[0].Content = event.target.value; 
        props.setComment("Comment", comments); 
    } 

    if (props.comments !== undefined) {
        // abstract out the button components 
        return (
            <>
                {reports.length > 0  ? 
                  <ShowCommentModal setComments={setComments} comments={comments} icon={<WarningIcon />} color={"red"} editable={editable}/> :
                  <Button>Add Report</Button>}
                {comments.length > 0 ? 
                  <ShowCommentModal setComments={setComments} comments={comments} icon={<ChatIcon />} color={"blue"} editable={editable}/> :
                  <Button>Add Comment</Button>}
            </>
        )
    } else {
        // if editable is true, then the user is an supervisor or admin and should be able to add reports/comments as well
        return (
          <>
            {editable &&
              <>
                <Button>Add Report</Button>    
                <Button>Add Comment</Button>
              </>}
          </>
        )
    }

}