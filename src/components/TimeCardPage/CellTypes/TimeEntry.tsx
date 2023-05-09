import React, {useEffect, useMemo, useState} from 'react'; 
import {RowSchema} from '../../../schemas/RowSchema'; 
import TimePicker from 'react-time-picker';


interface TimeEntryProps {
    field: string; 
    row: RowSchema; 
    updateFields: Function; 
}

export function TimeEntry(props:TimeEntryProps) {
    const [minutes, setMinutes] = useState(undefined); 

    const onChange = (time) => {
        const [hours, parsedMinutes] = time.split(":");   
        const calculatedTime = Number(hours) * 60 + Number(parsedMinutes)
        setMinutes(calculatedTime); 
        
        //Triggering parent class to update its references here as well 
        var rowToMutate = props.row.Associate; 
        if (rowToMutate === undefined) {
            rowToMutate = {
                Start:undefined, End:undefined, Author:0 
            }
        }
        rowToMutate[props.field] = calculatedTime; 
        props.updateFields("Associate", rowToMutate); 
    }
    useEffect(() => {
        if (props.row.Associate !== undefined) {
            setMinutes(props.row.Associate[props.field]); 
        }
    }, [])  
    
    return renderClockTime(minutes, onChange); 
}

const renderClockTime = (minutes:number, updateClockTime) => {
    if (minutes !== undefined) {
        const convertedTime = new Date();
        convertedTime.setHours(Math.round(minutes / 60)); 
        convertedTime.setMinutes(minutes % 60); 
        return <TimePicker onChange={(value) => {updateClockTime(value);}} value={convertedTime} disableClock={true} />
    }
    return <TimePicker onChange={(value) => {updateClockTime(value);}} value={null}  disableClock={true}  />
}