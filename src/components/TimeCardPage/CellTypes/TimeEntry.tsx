import React, { useEffect, useState } from "react";
import { RowSchema } from "../../../schemas/RowSchema";
import TimePicker from "react-time-picker";

interface TimeEntryProps {
  field: string;
  row: RowSchema;
  updateFields: Function;
  userType: string; // Associate, Supervisor, or Admin
}

export function TimeEntry(props: TimeEntryProps) {
  const [minutes, setMinutes] = useState(undefined);

    const onChange = (time) => {
        // TODO : This seems to be only able to hook up to the associates.
        // We probably want this to easily switch between supervisor vs. associated,
        // maybe an enum passed in via the props, similar to the field?
        var rowToMutate = props.row[props.userType]; 
        if (rowToMutate === undefined) {
            rowToMutate = {
                Start:undefined, End:undefined, AuthorID:"<TODO-add ID>"
            }
        }


        if (time !== null) {
            const [hours, parsedMinutes] = time.split(":");   
            const calculatedTime = Number(hours) * 60 + Number(parsedMinutes)
            setMinutes(calculatedTime); 
            rowToMutate[props.field] = calculatedTime; 
        } else {
            // Value is null, so mark it as undefined in our processing 
            rowToMutate[props.field] = undefined; 
            setMinutes(undefined); 
        }
        //Triggering parent class to update its references here as well 
        props.updateFields(props.userType, rowToMutate); 
    }
  
  useEffect(() => {
    if (props.row.Associate !== undefined) {
      setMinutes(props.row[props.userType][props.field]);
    }
  }, []);

  return renderClockTime(minutes, onChange);
}

const renderClockTime = (minutes: number, updateClockTime) => {
  if (minutes !== undefined) {
    const convertedTime = new Date();
    convertedTime.setHours(Math.round(minutes / 60));
    convertedTime.setMinutes(minutes % 60);
    return (
      <TimePicker
        onChange={(value) => {
          updateClockTime(value);
        }}
        value={convertedTime}
        disableClock={true}
      />
    );
  }
  return (
    <TimePicker
      onChange={(value) => {
        updateClockTime(value);
      }}
      value={null}
      disableClock={true}
    />
  );
};
