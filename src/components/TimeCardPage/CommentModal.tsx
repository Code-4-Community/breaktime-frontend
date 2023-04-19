//import { Menu, MenuButton, MenuItem } from '@aws-amplify/ui-react';
import {
    Input, Button, useDisclosure, Modal,
    ModalContent, ModalHeader, VStack, Card, CardBody, StackDivider, ModalFooter
} from '@chakra-ui/react'
import { useFormik } from "formik";
import React from 'react';

export default function CommentModal(props) {

    // enum for the type of comment the manager is leaving
    enum CommentType {
        Report,
        Comment,
    }

    const formik = useFormik({
        // TODO: add options for supervisor to choose from for the report
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
                            {/* <Menu
                            >
                                <MenuButton as={Button}>
                                    Type
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>Report</MenuItem>
                                    <MenuItem>Comment</MenuItem>
                                </MenuList>
                            </Menu> */}

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