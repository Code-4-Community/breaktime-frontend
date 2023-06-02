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
    Text,
    IconButton,
    useDisclosure
  } from '@chakra-ui/react';
import {
    ChatIcon,
    WarningIcon
  } from '@chakra-ui/icons';

import {CommentSchema} from '../../../schemas/RowSchema'; 
import {CommentType, CellStatus} from '../types'; 
import {TIMEZONE} from '../../../constants'; 
import { UserSchema } from 'src/schemas/UserSchema';

interface CommentProps {
    comments: CommentSchema[] | undefined; 
    setComment: Function; 
    user: UserSchema
} 

interface CommentModalProps{
    comment: CommentSchema;
    icon;
    color: string;
    editable: boolean;
}

function CommentModal(props:CommentModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
      <>
        <IconButton colorScheme={props.color} aria-label='Report' icon={props.icon} onClick={onOpen} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{props.comment.Type}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{props.comment.Content}</Text>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
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
        if (props.comments === undefined) {
            //Create one empty comment 
            setComments([{
                AuthorID:"<TODO Fill this in at some point>", 
                Type: CommentType.Comment, 
                Timestamp: moment().tz(TIMEZONE).unix(), 
                Content:"",
                State: CellStatus.Active 
            }]); 
        }
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

    // change this
    // so change to be a button 
    // pop up comment modal
    // basically add in functionality for comment/report

    //<input defaultValue={comments[comments.length - 1].Content} onChange={() => onUpdate} />
    //<IconButton colorScheme="blue" aria-label='Comment' icon={<ChatIcon />} onClick={() => onUpdate} /> 

    //<input placeholder="Any comments?" onChange={() => onUpdate} />

    // Currently the view for employee

    if (props.comments !== undefined) {
        return (
            <>
                {reports.length > 0 ? <CommentModal comment={reports[reports.length - 1]} icon={<WarningIcon />} color={"red"} editable={editable}/> : <></>}
                <CommentModal comment={comments[comments.length - 1]} icon={<ChatIcon />} color={"blue"} editable={editable}/>
            </>
        )
    } else {
        // if editable is true, then the user is an supervisor or admin and should be able to add reports/comments as well
        return (
        <>
          {editable ? 
            <>
              <Button>add Report</Button>    
              <Button>add Comment</Button>
            </> : <></>}
        </>
        )
    }

}