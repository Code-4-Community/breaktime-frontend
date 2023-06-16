//import { Menu, MenuButton, MenuItem } from '@aws-amplify/ui-react';
import {
    Input, Button, useDisclosure, Modal,
    ModalContent, ModalHeader, VStack, StackDivider, ModalFooter, HStack, Center
} from '@chakra-ui/react'
import React, { useState } from 'react';
import { Select } from '@chakra-ui/react'
import { CommentType } from './types';
import { CommentSchema } from 'src/schemas/RowSchema';
import { createNewComment } from './CellTypes/CommentCell';
// for now display samething for weekly and daily, if needed split into two components later

// setComments can be used for comments or reports
interface DailyCommentModalProps{
    setComments:Function;
    comments: CommentSchema[];
    type:CommentType;
}

export default function DailyCommentModal(props:DailyCommentModalProps) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [remark, setRemark] = useState()

    // stores the remark that was made
    const handleRemarkChange = (e) => {
        setRemark(e.target.value)
    }

    // duplicated code, can def be abstracted if needed
    const handleSubmit = () => {
        props.setComments([...props.comments, createNewComment(props.type, remark)])
        console.log("saved")
        // clean up abstractions and duplication otherwise fully done
        // call to db
    }



    return (
        <>
            <Center>
                <Button gap={20} display="flex" onClick={onOpen} bg="white" color="black">Comments/Reports</Button>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <VStack spacing={4} divider={<StackDivider />}>
                        <ModalHeader>Leave a comment/report</ModalHeader>

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
                                <Button type='submit' onClick={handleSubmit}>Submit</Button>
                            </HStack>
                        </ModalFooter>

                    </VStack>
                </ModalContent>
            </Modal>
        </>
    )
}