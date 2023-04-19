import React, { useState, useEffect } from 'react'
//import { Button } from 'react-bootstrap';
import {
    Input, Button, useDisclosure, Modal,
    ModalContent, ModalHeader, VStack, Card, CardBody, StackDivider, ModalFooter
}
    from '@chakra-ui/react'
import { useFormik } from "formik";

export default function CommentModal(props) {

    // enum for the type of comment the manager is leaving
    const CommentType = {
        Report: "Rejected",
        Comment: "Comment"
    }

    const formik = useFormik({
        initialValues: {
            type: "",
            remarks: "",
        },
        onSubmit: (values) => {
            // TODO: utilize a POST request to send comment to the backend (data is stored in 'values')
            alert(JSON.stringify(values, null, 2));
        }
    });

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Button onClick={onOpen}>Comments/Reports</Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                colorScheme={"red"}
            >
                <ModalContent>
                    <VStack spacing={4} divider={<StackDivider />}>
                        <ModalHeader>Leave a comment/report</ModalHeader>
                        <form onSubmit={formik.handleSubmit}>
                            <label htmlFor="remarks">Remarks</label>
                            <Input
                                id="remarks"
                                name="remarks"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.remarks}
                            />
                            <label htmlFor="Type">Type</label>
                            <Input
                                id="type"
                                name="type"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.type}
                                placeholder="Enter Comment/Report"
                            />
                            <Menu
                            >
                                <MenuButton as={Button}>
                                    Type
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>Report</MenuItem>
                                    <MenuItem>Comment</MenuItem>
                                </MenuList>
                            </Menu>

                            <button type='submit'>Submit</button>
                        </form>

                        <ModalFooter>
                            <Button onClick={onClose} >Cancel</Button>
                        </ModalFooter>
                    </VStack>
                </ModalContent>
            </Modal>
        </>

    )

}