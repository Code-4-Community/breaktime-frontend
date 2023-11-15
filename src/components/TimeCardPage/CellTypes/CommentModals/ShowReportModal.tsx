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
  RadioGroup,
  Radio,
  Stack,
  IconButton,
  useToast
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

import { CommentSchema, ReportSchema } from "../../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../../types";
import { ReportOptions } from "../../types";
import { getAllActiveCommentsOfType, createNewComment, createNewReport } from "../../utils";
import { Popover } from "react-bootstrap";

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

const savedEditedReport = ( ) => {
  

}

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
    console.log("Reports: ", reports)

    console.log("Data: ", reports[0])
    return (
      <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>View {CommentType.Report}</Text>
              <Button onClick={onOpenAdd}>
                New
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {reports.map(
              (report: ReportSchema) => (
                <VStack spacing={4} align="stretch">
                  {/* TODO: add UserDisplay card once pr merged in*/}
                  <FormControl>
                    <FormLabel>
                      Reason for report:
                    </FormLabel>
                    <Editable
                      isDisabled={!isEditable}
                      defaultValue={report.Content}
                      // TODO: issue with saveEditedComment losing notify data and explanation data - probably should make an entirely different method
                      onSubmit={(value) => saveEditedComment(setReports, reports, CommentType.Report, report, createNewComment(user, CommentType.Report, value))}
                    >
                      <EditablePreview />
                      {` ${moment.unix(report.Timestamp).format("h:mm a")}`}
                      {isEditable && (
                        <>
                          <Input as={EditableInput} />
                        </>
                      )}
                    </Editable>
                  </FormControl>
                  <FormControl>
                    <FormLabel>
                      Supervisor notified? : 
                    </FormLabel>
                    <Editable
                      isDisabled={!isEditable}
                      defaultValue = {report.Notified}>
                        <EditablePreview />
                        {isEditable && (
                          <>
                            <Input as={EditableInput} />
                          </>
                        )}
                    </Editable>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>
                      Explanation: 
                    </FormLabel>
                    <Editable
                    isDisabled={!isEditable}
                    defaultValue = {report.Explanation}>
                      <EditablePreview />
                      {isEditable && (
                          <>
                            <Input as={EditableInput} />
                          </>
                        )}
                  </Editable>
                  <HStack>
                            {/* TODO: add editable controls specifically with only enum options*/}
                            <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => deleteComment(onCloseDisplay, setReports, reports, CommentType.Report, report)} />
                          </HStack>
                  </FormControl>
                </VStack>
              ))}
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

   // base functionality based off this
  const AddReportModal = () => {
    const [remark, setRemark] = useState<ReportOptions>(ReportOptions.Late);
    const [submitDisabled, setSubmitDisabled] =  useState(false);
    const [selectedTime, setSelectedTime] = useState(moment(date)); // fix this rn

    const [reason, setReason] = useState<ReportOptions>(ReportOptions.Late);
    const [notify, setNotify] = useState('Yes');
    const [explanation, setExplanation] = useState('');

    const user = useContext(UserContext);
    const toast = useToast();

    //Not sure if we need this
    // const handleRemarkChange = (e) => {
    //   setRemark(e.target.value);
      
    //   if (e.target.value === ReportOptions.Absent) {
    //     setSubmitDisabled(false);
    //   }
    // };

    //Not sure if we need this
    // const handleTimeChange = (e) => {
    //   if (e.target.value) {
    //     setSubmitDisabled(false);
    //     setSelectedTime(selectedTime.hour(e.target.value.split(":")[0]))
    //     setSelectedTime(selectedTime.minute(e.target.value.split(":")[1]))
    //   }
    // };

    const handleReasonChange = (option) => {
      setReason(option as ReportOptions);
    }

    //make sure submission works like this
    const handleSubmit = (e) => {
      e.preventDefault();
      if (reports.filter(report => report.Content === reason).length === 0) {
        setReports([...reports, createNewReport(user, reason, notify, explanation, selectedTime.unix())]);
        toast({
          title: 'Report submitted.',
          description: "We've received your report.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        console.log(createNewReport(user, reason, notify, explanation, parseInt(selectedTime.format('X')))); // currently gmt TODO: fix later
      } else {
        toast({
          title: 'Report submission failed.',
          description: "There was a problem with your report. Please try again",
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
      onCloseAdd()
      // TODO: call to db
    };

    return (
      <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
        <ModalContent>
          <VStack spacing={4} divider={<StackDivider />}>
            <ModalHeader>{CommentType.Report}</ModalHeader>

            <Box p={4} boxShadow='md' borderRadius='md'>
              <form onSubmit={handleSubmit}>
                <FormControl as='fieldset'>
                  <FormLabel as='legend'>Select reason for report:</FormLabel>
                  <RadioGroup onChange={handleReasonChange} value={reason}>
                    <Stack direction='row'>
                      <Radio value={ReportOptions.Late}>Tardy</Radio>
                      <Radio value={ReportOptions.Absent}>Absent</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Did the associate notify the supervisor reasonably in advance?</FormLabel>
                  <RadioGroup onChange={setNotify} value={notify}>
                    <Stack direction='row'>
                      <Radio value='Yes'>Yes</Radio>
                      <Radio value='No'>No</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Why did the associate arrive late/leave early?</FormLabel>
                  <Input
                    placeholder='Enter answer'
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </FormControl>

              </form>
            </Box>
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
