import React, { useEffect, useState } from "react";
import { RowSchema } from "../../../schemas/RowSchema";
import TimePicker from "react-time-picker";

interface TimeEntryProps {
  field: string;
  row: RowSchema;
  updateFields: Function;
}

export function TimeEntry(props: TimeEntryProps) {
  const [minutes, setMinutes] = useState(undefined);

    const onChange = (time) => {
        let calculatedTime;
        // TODO: account for possible time deletions when updating DB and whatnot
        if (time === null) {
        calculatedTime = undefined;
        } else {
        const [currentHours, parsedMinutes] = time.split(":");
        calculatedTime = Number(currentHours) * 60 + Number(parsedMinutes);
        }

        setMinutes(calculatedTime); 
        
        //Triggering parent class to update its references here as well 
        var rowToMutate = props.row.Associate; 
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
        props.updateFields("Associate", rowToMutate); 
    }
  
  useEffect(() => {
    if (props.row.Associate !== undefined) {
      setMinutes(props.row.Associate[props.field]);
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
