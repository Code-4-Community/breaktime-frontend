import React, {useEffect, useState} from 'react'; 
import {RowSchema} from '../../../schemas/RowSchema'; 


interface DurationProps {
    row: RowSchema
}

export function Duration(props:DurationProps) {
    const row = props.row; 
    const [duration, setDuration] = useState(""); 

    useEffect(() => {
        if (row.Associate !== undefined && row.Associate.Start !== undefined && row.Associate.End !== undefined) {
            setDuration(String(((row.Associate.End - row.Associate.Start) / 60).toFixed(2))); 
        }
    }, [row.Associate?.Start, row.Associate?.End])
    return <div>{duration}</div>  
}