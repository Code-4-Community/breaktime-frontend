import React, {useEffect, useState} from 'react'; 
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { Fragment } from 'react';

import { Td } from '@chakra-ui/react'; 
 
import { TimeEntry } from './CellTypes/TimeEntry';
import {Duration} from './CellTypes/HoursCell' 
import {DateCell} from './CellTypes/DateCell'; 
import { TypeCell } from './CellTypes/CellType';
import { CommentCell } from './CellTypes/CommentCell';
import {RowSchema} from '../../schemas/RowSchema'; 

interface RowProps {
    row: RowSchema; 
    prevDate: number; 
    onRowChange: Function; 
} 

function Row(props: RowProps) { 
  
    const [fields,setFields] = useState<undefined | RowSchema>(undefined); 

    const updateField = (key, value) => {
        const newFields = {
            ...fields, 
            [key]: value 
        }
        setFields(newFields); 
        props.onRowChange(newFields); 
        
    } 

    useEffect(() => {
        if (props.row !== undefined) {
            setFields(RowSchema.parse(props.row)); 
        }
    }, [])

    if (fields !== undefined) {
        const items = { 
            "Type": <TypeCell value={fields.Type} setType={updateField}/>,
            "Date": <DateCell date={fields.Date} prevDate={props.prevDate}/>, 
            "Clock-in": <TimeEntry row={fields} field={"Start"} updateFields={updateField}/>, 
            "Clock-out": <TimeEntry row={fields} field={"End"} updateFields={updateField}/>, 
            "Hours": <Duration row={fields}/>, 
            "Comment": <CommentCell comments={fields.Comment} setComment={updateField}/>, 
        }
        const itemOrdering = ["Type", "Date", "Clock-in", "Clock-out", "Hours", "Comment"];

        return <Fragment>
            {itemOrdering.map((entry) => <Td key={entry}>{items[entry]}</Td>)}
        </Fragment>
    
    } else {
        return <Fragment>

        </Fragment>
    }
}

export default Row; 