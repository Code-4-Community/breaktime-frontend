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
  HStack,
  VStack,
  Text,
  RadioGroup,
  Radio,
  Stack,
  IconButton,
  useToast,
  InputRightElement,
  InputGroup,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

import {
  WarningIcon,
  AddIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";

import { CommentSchema, ReportSchema } from "../../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../../types";
import { ReportOptions } from "../../types";
import { getAllActiveCommentsOfType, createNewReport } from "../../utils";

const saveEditedReport = (
  setReports: Function, 
  comments: ReportSchema[], 
  prevComment: ReportSchema, 
  newComment: ReportSchema) => {
  // previous comment edited over so set it to deleted
  prevComment.State = CellStatus.Deleted
  setReports(getAllActiveCommentsOfType(CommentType.Report, [...comments, newComment]) as ReportSchema[]);
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
  reports: ReportSchema[];
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
      <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay} isCentered>
        <ModalOverlay/>
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
              (report) => (
                <VStack spacing={4} align="stretch">
                  {/* TODO: add UserDisplay card once pr merged in*/}
                  <FormControl>
                  {/* <Text> {TODO: show time}</Text> */}
                    <FormLabel>
                      Reason for report:
                    </FormLabel>
                    <Editable
                      isDisabled={!isEditable}
                      defaultValue={report.Content}
                      onSubmit={(value) => 
                        saveEditedReport(setReports, reports, report, 
                        createNewReport(user, value as ReportOptions, report.Notified, report.Explanation))}
                    >
                      <EditablePreview />
                    </Editable>
                  </FormControl>
                  <FormControl>
                    <FormLabel>
                      Supervisor notified reasonably in advance: 
                    </FormLabel>
                    <Editable
                      isDisabled={!isEditable}
                      defaultValue = {report.Notified}
                      onSubmit={(value) => 
                        saveEditedReport(setReports, reports, report, 
                        createNewReport(user, report.Content, value, report.Explanation))}
                      >
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
                    defaultValue = {report.Explanation}
                    onSubmit={(value) => 
                      saveEditedReport(setReports, reports, report, 
                      createNewReport(user, report.Content, report.Notified, value))}
                    >
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

  const AddReportModal = () => {
    const [submitDisabled, setSubmitDisabled] =  useState(false);

    const [reason, setReason] = useState<ReportOptions>(ReportOptions.Late);
    const [notify, setNotify] = useState('Yes');
    const [explanation, setExplanation] = useState('');

    const user = useContext(UserContext);
    const toast = useToast();

    const handleReasonChange = (option) => {
      setReason(option as ReportOptions);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      if (reports.filter(report => report.Content === reason).length === 0) {
        setReports([...reports, createNewReport(user, reason, notify, explanation)]);
        toast({
          title: 'Report submitted.',
          description: "We've received your report.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
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
      <Modal isOpen={isOpenAdd} onClose={onCloseAdd} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl"  maxW="500px">
          <VStack spacing={1}>
          <Box bg="#1C1A6C" w="100%" pt={1} pb={1} pl={2} pr={2} color="white" borderTopRadius="xl">
            <ModalHeader textAlign="center" p={1} m={1}>{CommentType.Report}</ModalHeader>
          </Box>

            <Box p={4} >
              <form onSubmit={handleSubmit}>
                <FormControl as='fieldset'>
                  <FormLabel as='legend'>Select reason for report:</FormLabel>
                  <RadioGroup onChange={handleReasonChange} value={reason}>
                    <Stack direction='column'>
                      <Radio value={ReportOptions.Late}>Tardy</Radio>
                      <Radio value={ReportOptions.Absent}>Absent</Radio>
                      <Radio value={ReportOptions.LeftEarly}>Left Early</Radio>
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
                  <FormLabel>Why did the associate arrive late/no show/leave early?</FormLabel>
                    <InputGroup width='150px' borderRadius="2xl">
                      <Input
                        placeholder="Enter answer"
                        borderRadius="2xl"
                        padding="1rem"
                        borderColor="gray.300"
                        _placeholder={{ opacity: 1, color: 'gray.500' }}
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                      />
                      <InputRightElement
                        children={<EditIcon/>}
                      />
                    </InputGroup>
                </FormControl>

              </form>
            </Box>
            <ModalFooter>
              <HStack spacing={10}>
                <Button style={{borderRadius:'15px'}} onClick={onCloseAdd}>Close</Button>
                <Button style={{borderRadius:'15px'}} isDisabled={submitDisabled} type="submit" onClick={handleSubmit}>
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
