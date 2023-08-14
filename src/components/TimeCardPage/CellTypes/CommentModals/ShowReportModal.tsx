import React, { useState, useContext } from "react";
import moment from "moment";
import { UserContext } from "../../UserContext";
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
  EditablePreview,
  EditableInput,
  Input,
  Box,
  useDisclosure,
  StackDivider,
  HStack,
  VStack,
  Text,
  Select,
  IconButton
} from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react'

import {
  WarningIcon,
  AddIcon,
  DeleteIcon
} from "@chakra-ui/icons";

import { CommentSchema } from "../../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../../types";
import { ReportOptions } from "../../types";
import { getAllActiveCommentsOfType, createNewComment, createNewReport } from "../../utils";

const saveEditedComment = (
  setComments: Function, 
  comments: CommentSchema[], 
  typeOfComment: CommentType, 
  prevComment: CommentSchema, 
  newComment: CommentSchema) => {
  // previous comment edited over so set it to deleted
  prevComment.State = CellStatus.Deleted
  setComments(getAllActiveCommentsOfType(typeOfComment, [...comments, newComment]));
  // TODO: save to DB
};

const deleteComment = (
  onCloseDisplay: Function, 
  setComments: Function, 
  comments: CommentSchema[], 
  typeOfComment: CommentType, 
  comment: CommentSchema) => {
  // TODO: add confirmation popup
  comment.State = CellStatus.Deleted
  setComments(getAllActiveCommentsOfType(typeOfComment, comments));
  if (comments.length === 1) {
    onCloseDisplay()
  }
  // TODO: save to DB
}

interface ShowReportModalProps {
  date: number;
  reports: CommentSchema[];
  setReports: Function;
  isEditable: boolean;
}

export default function ShowReportModal({
  date,
  reports,
  setReports,
  isEditable
}: ShowReportModalProps) {
  const { isOpen: isOpenDisplay, onOpen: onOpenDisplay, onClose: onCloseDisplay } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const user = useContext(UserContext);
  let color = Color.Red

  const doReportsExist = reports.length > 0

  // no reports so gray it out
  if (doReportsExist === false) {
    color = Color.Gray
  }

  const DisplayReportsModal = () => {

    return (
      <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>View {CommentType.Report}</Text>
              {isEditable && <Button onClick={onOpenAdd}>
                New
              </Button>}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {reports.map(
              (report) => (
                <HStack>
                  {/* TODO: add UserDisplay card once pr merged in*/}
                  <Editable
                    isDisabled={!isEditable}
                    defaultValue={report.Content}
                    onSubmit={(value) => saveEditedComment(setReports, reports, CommentType.Report, report, createNewComment(user, CommentType.Report, value))}
                  >
                    <EditablePreview />
                    {` ${moment.unix(report.Timestamp).format("h:mm")}`}
                    {isEditable && (
                      <>
                        <Input as={EditableInput} />
                        <HStack>
                          {/* TODO: add editable controls specifically with only enum options*/}
                          <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => deleteComment(onCloseDisplay, setReports, reports, CommentType.Report, report)} />
                        </HStack>
                      </>
                    )}
                  </Editable>

                </HStack>
              ))}
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  const AddReportModal = () => {
    const [remark, setRemark] = useState<ReportOptions>(ReportOptions.Late);
    const [submitDisabled, setSubmitDisabled] =  useState(true);
    const [selectedTime, setSelectedTime] = useState(moment(date)); // fix this rn
    const user = useContext(UserContext);
    

    const handleRemarkChange = (e) => {
      setRemark(e.target.value);
      
      if (e.target.value === ReportOptions.Absent) {
        setSubmitDisabled(false);
      }
    };

    const handleTimeChange = (e) => {
      if (e.target.value) {
        setSubmitDisabled(false);
        setSelectedTime(selectedTime.hour(e.target.value.split(":")[0]))
        setSelectedTime(selectedTime.minute(e.target.value.split(":")[1]))
      }
    };

    const handleSubmit = () => {
      if (reports.filter(report => report.Content === remark).length === 0) {
        setReports([...reports, createNewReport(user, remark, selectedTime.unix())]);
        console.log(createNewReport(user, remark, parseInt(selectedTime.format('X')))); // currently gmt TODO: fix later
      }

      alert(`Your ${CommentType.Report} has been submitted!`);
      onCloseAdd()
      // TODO: call to db
    };

    return (
      <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
        <ModalContent>
          <VStack spacing={4} divider={<StackDivider />}>
            <ModalHeader>{CommentType.Report}</ModalHeader>

            <FormControl onSubmit={handleSubmit}>
              <FormLabel htmlFor="reports">Reports</FormLabel>
              <Select onChange={handleRemarkChange}>
                <option value={ReportOptions.Late}>{ReportOptions.Late}</option>
                <option value={ReportOptions.LeftEarly}>{ReportOptions.LeftEarly}</option>
                <option value={ReportOptions.Absent}>{ReportOptions.Absent}</option>
              </Select>
              {remark !== ReportOptions.Absent &&
                <>
                  <Text>
                    Enter time employee was meant to 
                    {remark === ReportOptions.LeftEarly ? 
                    " leave" : " arrive"
                    } 
                  </Text>
                  <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="time"
                    onChange={handleTimeChange}
                    />
                </> }
            </FormControl>

            <ModalFooter>
              <HStack spacing={10}>
                <Button onClick={onCloseAdd}>Close</Button>
                <Button isDisabled={submitDisabled} type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </HStack>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <>
      <Box color={color}>
        {doReportsExist ?
          <>
            <Button
              colorScheme={color}
              aria-label="Report"
              leftIcon={<WarningIcon />}
              onClick={onOpenDisplay} >
              {reports.length}
            </Button>
            {isEditable &&
              <Button
                colorScheme={color}
                aria-label="Add Feedback"
                leftIcon={<AddIcon />}
                onClick={onOpenAdd} />
            }
          </> :
          <>
            {isEditable && <Button
              colorScheme={color}
              aria-label="Report"
              leftIcon={<WarningIcon />}
              onClick={onOpenAdd}>
              <AddIcon />
            </Button>}
          </>
        }
      </Box>
      <DisplayReportsModal />
      <AddReportModal />
    </>
  );
}
