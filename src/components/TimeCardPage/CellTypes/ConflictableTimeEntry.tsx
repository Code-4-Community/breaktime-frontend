import React, { useEffect, useState } from "react";
import { RowSchema, TimeRowEntry } from "../../../schemas/RowSchema";
import { TimeEntry } from "./TimeEntry";

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
  const [selectedTime, setSelectedTime] = useState('');

  const handleTimePickerClick = () => {
    setIsPopupOpen(true);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setIsPopupOpen(false);
  }

  // determine if the associate and supervisor times are conflicting for this cell
  const hasAssociateTime: boolean = props.row.Associate !== undefined;
  const hasSupervisorTime: boolean = props.row.Supervisor !== undefined;
  
  // Conflicts are defined as: 
  // 1. associate submitted a time, and supervisor did not
  // 2. Supervisor submitted a time for this entry, and associate did not
  // 3. Associate time and supervisor reported time differ
  var hasConflict = (hasAssociateTime !== hasSupervisorTime) 
  || props.row.Associate[props.field] !== props.row.Supervisor[props.field];

  // TODO: Time picker, similar to TimeEntry component
  // How should we autofill this? We might need to rework TImeEntry or create a new timepicker
  // The Admin time should autofill to the correct time if matching, or the associate time if conflicting
  const timePicker = TimeEntry({field: props.field, 
    row: props.row, 
    updateFields: props.updateFields, 
    userType: "Admin"
  })

  // TODO: Toggle clicker to display popup with conflict only if hasConflict is true
  return <>
      {hasConflict && <button>Button</button>}
      // TODO : hook up this popup with the button
      <TimeConflictPopup
          field={props.field}
          associateEntry={props.row.Associate}
          supervisorEntry={props.row.Supervisor}
          onSelectTime={handleTimeSelection}
        />
      timePicker
    </>

  // TODO: make sure to update props field appropriately to trigger the correct autosaving
}

interface TimeConflictPopupProps {
  field: string;
  associateEntry: TimeRowEntry;
  supervisorEntry: TimeRowEntry;
  onSelectTime: Function;
}

export function TimeConflictPopup(props: TimeConflictPopupProps) {

}