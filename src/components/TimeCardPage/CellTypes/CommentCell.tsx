import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { UserContext } from "../UserContext";
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
  ButtonGroup,
  Flex,
  useDisclosure,
  useEditableControls,
  Stack,
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
  ChatIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  AddIcon,
  DeleteIcon
} from "@chakra-ui/icons";

import { CommentSchema } from "../../../schemas/RowSchema";
import { CommentType, CellStatus, Color } from "../types";
import { ReportOptions } from "../types";
import { getAllActiveCommentsOfType, createNewComment } from "../utils";
import { UserSchema } from "src/schemas/UserSchema";

const createNewReport = (
  user: UserSchema,
  content: ReportOptions,
  correctTime: number
) => {
  return {
    AuthorID: user?.UserID, // need to add loading logic so user is defined before anything occurs
    Timestamp: moment().unix(), // TODO: possibly change it to be more specific formatting
    CorrectTime: correctTime,
    Content: content,
    State: CellStatus.Active,
  };
};

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

function ShowReportModal({
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

  // TODO: fix up styling
  // Fix this to match figma
  const DisplayReportsModal = () => {

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
              (report) => (
                <HStack>
                  {/* add UserDisplay card once pr merged in*/}
                  <Editable
                    isDisabled={!isEditable}
                    defaultValue={report.Content}
                    onSubmit={(value) => saveEditedComment(setReports, reports, CommentType.Report, report, createNewComment(user, CommentType.Report, value))}
                  >
                    <EditablePreview />

                    {isEditable && (
                      <>
                        <Input as={EditableInput} />
                        <HStack>
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
    const user = useContext(UserContext);
    const correctedTime = moment.unix(date);

    const handleRemarkChange = (e) => {
      setRemark(e.target.value);
      
      if (e.target.value === ReportOptions.Absent) {
        setSubmitDisabled(false);
      }
    };

    const handleTimeChange = (e) => {
      if (e.target.value) {
        setSubmitDisabled(false);
        correctedTime.hour(e.target.value.split(":")[0])
        correctedTime.minute(e.target.value.split(":")[1])
      }
    };

    const handleSubmit = () => {
      if (reports.filter(report => report.Content === remark).length === 0) {
        setReports([...reports, createNewReport(user, remark, correctedTime.unix())]);
        console.log(createNewReport(user, remark, parseInt(correctedTime.format('X')))); // currently gmt TODO: fix later
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


interface ShowCommentModalProps {
  comments: CommentSchema[];
  setComments: Function;
  isEditable: boolean;
}

function ShowCommentModal({
  comments,
  setComments,
  isEditable,
}: ShowCommentModalProps) {
  const { isOpen: isOpenDisplay, onOpen: onOpenDisplay, onClose: onCloseDisplay } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const user = useContext(UserContext);
  let color = Color.Blue

  const EditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    // TODO: change this later to reflect figma
    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button leftIcon={<CheckIcon />} {...getSubmitButtonProps()} />
        <Button leftIcon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="right">
        <Button size="sm" leftIcon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  };

  const doCommentsExist = comments.length > 0

  // no comments so gray it out
  if (doCommentsExist === false) {
    color = Color.Gray
  }

  // TODO: make the editable work as intended later, without the odd preview box and whatever
  // TODO: fix up styling

  const DisplayCommentsModal = () => {

    return (
      <Modal isOpen={isOpenDisplay} onClose={onCloseDisplay}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>View {CommentType.Comment}</Text>
              <Button onClick={onOpenAdd}>
                New
              </Button>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {comments.map(
              (comment) => (
                <HStack>
                  {/* add UserDisplay card once pr merged in*/}
                  <Editable
                    isDisabled={!isEditable}
                    defaultValue={comment.Content}
                    onSubmit={(value) => saveEditedComment(setComments, comments, CommentType.Comment, comment, createNewComment(user, CommentType.Comment, value))}
                  >
                    <EditablePreview />

                    {isEditable && (
                      <>
                        <Input as={EditableInput} />
                        <HStack>
                          <EditableControls />
                          <IconButton aria-label="Delete" icon={<DeleteIcon />} onClick={() => deleteComment(onCloseDisplay, setComments, comments, CommentType.Comment, comment)} />
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

  const AddCommentModal = () => {
    const [remark, setRemark] = useState();
    const user = useContext(UserContext);

    const handleRemarkChange = (e) => {
      setRemark(e.target.value);
    };

    const handleSubmit = () => {
      // TODO: reuse comment validation
      setComments([...comments, createNewComment(user, CommentType.Comment, remark)]);
      alert(`Your ${CommentType.Comment} has been submitted!`);
      onCloseAdd()
      // TODO: call to db
    };

    return (
      <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
        <ModalContent>
          <VStack spacing={4} divider={<StackDivider />}>
            <ModalHeader>{CommentType.Comment}</ModalHeader>

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
                <Button onClick={onCloseAdd}>Close</Button>
                <Button type="submit" onClick={handleSubmit}>
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
        {doCommentsExist ?
          <>
            <Button
              colorScheme={color}
              aria-label="Report"
              leftIcon={<ChatIcon />}
              onClick={onOpenDisplay} >
              {comments.length}
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
              leftIcon={<ChatIcon />}
              onClick={onOpenAdd}>
              <AddIcon />
            </Button>}
          </>
        }
      </Box>
      <DisplayCommentsModal />
      <AddCommentModal />
    </>
  );
}


interface CommentProps {
  comments: CommentSchema[] | undefined;
  setComment: Function; // TODO: fix type
  date: number;
}

export function CommentCell({
  comments,
  setComment,
  date
}: CommentProps) {
  const [currentComments, setCurrentComments] = useState(
    getAllActiveCommentsOfType(CommentType.Comment, comments)
  );
  const [reports, setReports] = useState(
    getAllActiveCommentsOfType(CommentType.Report, comments)
  );
  const [isEditable, setisEditable] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    //Supervisor/Admins have the right to edit comments/reports
    if (user?.Type === "Supervisor" || user?.Type === "Admin") {
      setisEditable(true);
    }
  }, [user?.Type]);

  return (
    <Stack direction='row'>
      <ShowCommentModal
        setComments={setCurrentComments}
        comments={currentComments}
        isEditable={isEditable}
      />
      <ShowReportModal
        date={date}
        setReports={setReports}
        reports={reports}
        isEditable={isEditable}
      />
    </Stack>
  );
}