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
  // Date object for the time picker to take in
  const [convertedTime, setConvertedTime] = useState(null);

  // converted given minutes (number of minutes from 0:00) to Date() object, and update the converted time
  const convertMinutesToTime = (minutes) => {
    if (minutes !== undefined && minutes !== null) {
      const newTime = new Date();
      newTime.setHours(Math.round(minutes / 60));
      newTime.setMinutes(minutes % 60);
      setConvertedTime(newTime);
    } else {
      setConvertedTime(null);
    }
  };

  const handleChange = (time) => {
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

      // Reset the Date object to the new time - this handles what is actually
      // displayed in the time picker visually before page refresh
      const newTime = new Date();
      newTime.setHours(hours);
      newTime.setMinutes(parsedMinutes);
      setConvertedTime(newTime);
    } else {
      // Value is null, so mark it as undefined in our processing
      rowToMutate[props.field] = undefined;
      setConvertedTime(null);
    }
    //Triggering parent class to update its references here as well
    props.updateFields(props.userType, rowToMutate);
  };

  useEffect(() => {
    let minutes;
    if (props.row[props.userType] !== undefined && props.row[props.userType] !== null) {
      minutes = (props.row[props.userType][props.field]);
    } else if (props.userType === "Admin") {
      minutes = props.time;
    }
    convertMinutesToTime(minutes);
    console.log(convertedTime);
  }, []);

  useEffect(() => {
    convertMinutesToTime(props.time);
    //handleChange(props.time);
    console.log("Input time has been changed, " + props.time);
  }, [props.time]);

  return (
    <TimePicker
      onChange={handleChange}
      value={convertedTime}
      disableClock={true}
    />
  );
}
