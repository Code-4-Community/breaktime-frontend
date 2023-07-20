import React, { useEffect, useState } from "react";
import { RowSchema } from "../../../schemas/RowSchema";
import TimePicker from "react-time-picker";

interface TimeEntryProps {
  field: string;
  row: RowSchema;
  updateFields: Function;
  userType: string; // Associate, Supervisor, or Admin
  time: number;
}

export function TimeEntry(props: TimeEntryProps) {
  const [convertedTime, setConvertedTime] = useState(undefined);

  const onChange = (time) => {
    // TODO : This seems to be only able to hook up to the associates.
    // We probably want this to easily switch between supervisor vs. associated,
    // maybe an enum passed in via the props, similar to the field?
    var rowToMutate = props.row[props.userType];
    if (rowToMutate === undefined) {
      rowToMutate = {
        Start: undefined,
        End: undefined,
        AuthorID: "<TODO-add ID>",
      };
    }

    if (time !== null) {
      const [hours, parsedMinutes] = time.split(":");
      const calculatedTime = Number(hours) * 60 + Number(parsedMinutes);
      rowToMutate[props.field] = calculatedTime;
    } else {
      // Value is null, so mark it as undefined in our processing
      rowToMutate[props.field] = undefined;
    }
    //Triggering parent class to update its references here as well
    props.updateFields(props.userType, rowToMutate);
  };

  useEffect(() => {
    let minutes;
    if (props.row[props.userType] !== undefined) {
      minutes = (props.row[props.userType][props.field]);
    }

    if (minutes !== undefined) {
      const newTime = new Date();
      newTime.setHours(Math.round(minutes / 60));
      newTime.setMinutes(minutes % 60);
      setConvertedTime(newTime);
    } else {
      setConvertedTime(null);
    }
  }, []);

  useEffect(() => {
    if (props.time !== undefined) {
      const newTime = new Date();
      newTime.setHours(Math.round(props.time / 60));
      newTime.setMinutes(props.time % 60);
      setConvertedTime(newTime);
    } else {
      setConvertedTime(null);
    }
  }, [props.time]);

  return (
    <TimePicker
      onChange={(value) => {
        onChange(value);
      }}
      value={convertedTime}
      disableClock={true}
    />
  );
}
