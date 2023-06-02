import moment from 'moment-timezone';
import React, {useState, useEffect, } from 'react'; 
import {Button} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    useDisclosure
  } from '@chakra-ui/react'

import {CommentSchema} from '../../../schemas/RowSchema'; 
import {CommentType, CellStatus} from '../types'; 
import {TIMEZONE} from '../../../constants'; 

interface CommentProps {
    comments: CommentSchema[] | undefined; 
    setComment: Function; 
} 

interface ReportProps{
    report: CommentSchema
}

function ReportModal(props:ReportProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    console.log(props);
    return (
      <>
        <Button colorScheme="red" onClick={onOpen}>Report</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Report</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{props.report.Content}</Text>
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
    }, []);  

    const onUpdate = (event) => {
        comments[0].Content = event.target.value; 
        props.setComment("Comment", comments); 
    } 

    // change this
    // so change to be a button 
    // pop up comment modal
    // basically add in functionality for comment/report

    if (props.comments !== undefined) {
        return (
            <>
                {reports.length > 0 ? <ReportModal report={reports[reports.length - 1]}/> : <></>}
                <input defaultValue={comments[comments.length - 1].Content} onChange={() => onUpdate} />
            </>
        )
    } else {
        return <input placeholder="Any comments?" onChange={() => onUpdate} />
    }

}