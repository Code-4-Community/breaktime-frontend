import React, { useEffect, useState } from "react";
import { RowSchema } from "../../../schemas/RowSchema";
import TimePicker from "react-time-picker";
import { boolean } from "zod";

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
  const [selectedTime, setSelectedTime] = useState('');

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

  // TODO: Toggle clicker to display popup with conflict only if hasConflict is true

  // TODO: make sure to update props field appropriately to trigger the correct autosaving
  
}