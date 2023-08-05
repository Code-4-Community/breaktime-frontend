import React, { useEffect, useState } from "react";
import { RowSchema, TimeRowEntry } from "../../../schemas/RowSchema";
import { TimeEntry } from "./TimeEntry";
import {
  IconButton,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons';



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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(undefined);

  const handleTimePickerClick = () => {
    setIsPopupOpen(true);
  };

  const handleTimeSelection = (time: number) => {
    setSelectedTime(time);
    setIsPopupOpen(false);
  };

  // determine if the associate and supervisor times are conflicting for this cell
  const hasAssociateTime: boolean = props.row.Associate !== undefined;
  const hasSupervisorTime: boolean = props.row.Supervisor !== undefined;

  // Conflicts are defined as:
  // 1. associate submitted a time, and supervisor did not
  // 2. Supervisor submitted a time for this entry, and associate did not
  // 3. Associate time and supervisor reported time differ
  var hasConflict =
    hasAssociateTime !== hasSupervisorTime ||
    props.row.Associate[props.field] !== props.row.Supervisor[props.field];

  // TODO: Toggle clicker to display popup with conflict only if hasConflict is true
  return (
    <>
      <TimeEntry
        field={props.field}
        row={props.row}
        updateFields={props.updateFields}
        userType="Admin"
        time={selectedTime}
      />
      {hasConflict && (
        <>
          <IconButton aria-label='Report' icon={<WarningIcon onClick={handleTimePickerClick}/>} />
          {isPopupOpen && (<TimeConflictPopup
            field={props.field}
            associateEntry={props.row.Associate}
            supervisorEntry={props.row.Supervisor}
            onSelectTime={handleTimeSelection}
          />)}
        </>
      )}
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
  return
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
}
