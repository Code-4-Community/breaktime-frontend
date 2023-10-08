import React, { useEffect, useState } from "react";
import { RowSchema } from "../../../schemas/RowSchema";
import { Input } from '@chakra-ui/react';
import moment from 'moment';

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
            console.log(calculatedTime);
            //rowToMutate[props.field] = calculatedTime; 
        } else {
            // Value is null, so mark it as undefined in our processing 
            rowToMutate[props.field] = undefined; 
            setMinutes(undefined); 
        }
        //Triggering parent class to update its references here as well 
        props.updateFields("Associate", rowToMutate); 
    }

    // converts minutes from 00:00 to the current hour and minute it represents
    const minutesFrom00 = (minutes) =>
      {
        // initialize an epoch that starts at 00:00 and add in the minutes
        // to string its hour and time
        const epoch = moment().set('hour', 0).set('minute', 0);
        epoch.add(minutes, 'minutes');
        return epoch.format("HH:mm");
      }
  
  useEffect(() => {
    if (props.row.Associate !== undefined) {
      setMinutes(minutesFrom00(props.row.Associate[props.field]));
    }
  }, []);

  return (
    <Input
      placeholder="Select Date and Time"
      size="md"
      type="time"
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={minutes}
      
    />
  );
}

