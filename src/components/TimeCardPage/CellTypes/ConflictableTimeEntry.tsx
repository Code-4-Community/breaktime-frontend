import React, { useEffect, useState } from "react";
import { RowSchema, TimeRowEntry } from "../../../schemas/RowSchema";
import { TimeEntry } from "./TimeEntry";
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
  StackDivider,
  HStack,
  VStack,
  Text,
  IconButton
} from "@chakra-ui/react";

import {
  ChatIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  AddIcon,
  DeleteIcon,
  WarningIcon
} from "@chakra-ui/icons";



interface ConflicatableTimeEntryProps {
  field: string;
  row: RowSchema;
  updateFields: Function;
}

/**
 * This represents a time entry cell that accounts for multiple time entries (i.e. an associate's and a supervisor's entries)
 * and allows for conflicts to be shown.
 */
export function ConflicatableTimeEntry(props: ConflicatableTimeEntryProps) {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeSelection = (time: number) => {
    setSelectedTime(time);
  };

  // determine if the associate and supervisor times are conflicting for this cell
  const hasAssociateTime: boolean = props.row.Associate !== undefined;
  const hasSupervisorTime: boolean = props.row.Supervisor !== undefined;
  const hasAdminTime: boolean = props.row.Admin !== undefined;

  // TODO :
  //  -- only show conflict button on conflict
  //  -- auto-populate with the following rules:
  //  ---- if associate and supervisor times are the same, auto-populate with that time
  //  ---- if associate and supervisor times are different, auto-populate with null
  //  -- make sure that time conflict entry cells only show up on admins 

  // Conflicts are defined as:
  // 1. associate submitted a time, and supervisor did not
  // 2. Supervisor submitted a time for this entry, and associate did not
  // 3. Associate time and supervisor reported time differ
  var hasConflict = hasAssociateTime !== hasSupervisorTime || 
  (hasAssociateTime && hasSupervisorTime && props.row.Associate[props.field] !== props.row.Supervisor[props.field]);

  useEffect(() => {
      if (!hasConflict && hasAssociateTime && !hasAdminTime) {
    setSelectedTime(props.row.Associate[props.field])
  } else if (hasAdminTime) {
    setSelectedTime(props.row.Admin[props.field])
  }
  }, []);

  // TODO: Toggle clicker to display popup with conflict only if hasConflict is true
  return (
    <>
      { hasConflict && (<TimeConflictPopup
        field={props.field}
        associateEntry={props.row.Associate}
        supervisorEntry={props.row.Supervisor}
        onSelectTime={handleTimeSelection}
      /> ) }
      <TimeEntry
        field={props.field}
        row={props.row}
        updateFields={props.updateFields}
        userType="Admin"
        time={selectedTime}
      />
    </>
  );

  // TODO: make sure to update props field appropriately to trigger the correct autosaving
}

interface TimeConflictPopupProps {
  field: string;
  associateEntry: TimeRowEntry;
  supervisorEntry: TimeRowEntry;
  onSelectTime: Function;
}

export function TimeConflictPopup(props: TimeConflictPopupProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const hasAssociateTime: boolean = props.associateEntry !== undefined && props.associateEntry !== null;
  const hasSupervisorTime: boolean = props.supervisorEntry !== undefined && props.supervisorEntry !== null;

  const associateTime: number = hasAssociateTime ? props.associateEntry[props.field] : null;
  const supervisorTime: number = hasSupervisorTime ? props.supervisorEntry[props.field] : null;

  const convertMinutesToTime = (minutes) => {
    const hours = Math.round(minutes / 60)
    const mins = minutes % 60;
    return hours + ":" + mins;
  }

  return (
    <>
      <IconButton aria-label='Conflict' icon={<WarningIcon />} onClick={onOpen}></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text>Time Conflict</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>These are the entries submitted:</Text>
            <HStack>
              <Button onClick={() => { props.onSelectTime(associateTime); onClose(); }}>Use Associate Time</Button>
              <Button onClick={() => { props.onSelectTime(supervisorTime); onClose();} }>Use Supervisor Time</Button>
            </HStack>
            <Text>Associate Time: {hasAssociateTime ? convertMinutesToTime(props.associateEntry[props.field]) : "none"}</Text>
            <Text>Supervisor Time: {hasSupervisorTime ? convertMinutesToTime(props.supervisorEntry[props.field]) : "none"}</Text>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>)
}