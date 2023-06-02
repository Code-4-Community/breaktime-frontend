//import { Menu, MenuButton, MenuItem } from '@aws-amplify/ui-react';
import {
    Input, Button, useDisclosure, Modal,
    ModalContent, ModalHeader, VStack, StackDivider, ModalFooter, HStack, Center
} from '@chakra-ui/react'
import React, { useState } from 'react';
import { Select } from '@chakra-ui/react'

export default function CommentModal() {

    // enum for the type of comment the manager is leaving
    enum CommentType {
        Default,
        Report,
        Comment,
    }

    // enum for the day of the week
    enum Day {
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [type, setType] = useState()
    const [remark, setRemark] = useState()
    const [day, setDay] = useState()


    var commentMap = new Map()


    // stores what type of remark was made
    const handleSubmit = (e) => {
        setType(e.target.value)
    }

    // stores the remark that was made
    const handleChange = (e) => {
        setRemark(e.target.value)
    }

    // stores the day for which the remark was made
    const handleChangeDay = (e) => {
        setDay(e.target.value)
    }

    const handleAllSubmit = (e) => {
        const comments = []
        comments.push(type, remark)
        commentMap.set(day, comments)

        alert("Your comment has been submitted!");

        // TODO: can use values stored in commentMap to store comments in backend
        // values are stored in the form of {Day : [CommentType, "comment"]}

        // TODO: use addRow and delRow functions in TimeTable to mutate timesheets in backend
        // - steps:
        // - delete existing row for specific day
        // - create new row with added comments
        // - add this new row to the timesheet
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

                        <form id="Form" onSubmit={handleAllSubmit}>

                            <HStack spacing={4}>
                                <label htmlFor="Day">Day</label>
                                <Select onChange={handleChangeDay}>
                                    <option value='Monday'>Monday</option>
                                    <option value='Tuesday'>Tuesday</option>
                                    <option value='Wednesday'>Wednesday</option>
                                    <option value='Thursday'>Thursday</option>
                                    <option value='Friday'>Friday</option>
                                    <option value='Saturday'>Saturday</option>
                                    <option value='Sunday'>Sunday</option>
                                </Select>
                                <label htmlFor="remarks">Remarks</label>
                                <Input
                                    id="remarks"
                                    name="remarks"
                                    type="text"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                <label htmlFor="Type">Type</label>
                                <Select onChange={handleSubmit}>
                                    <option value='Comment'>Comment</option>
                                    <option value='Report'>Report</option>
                                </Select>

                            </HStack>

                        </form>

                        <ModalFooter>
                            <HStack spacing={10}>
                                <Button onClick={onClose} >Close</Button>
                                <Button type='submit' onClick={handleAllSubmit}>Submit</Button>
                            </HStack>
                        </ModalFooter>

                    </VStack>
                </ModalContent>
            </Modal>
        </>
    )
}