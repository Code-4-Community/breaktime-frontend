import Table from 'react-bootstrap/Table' 
import React, {useEffect, useState} from 'react'; 
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


const renderUneditableCell = (entry, props, colKey) => {
    return entry 
}

const renderClockTimes = (clockTime, props, colKey) => {
    return <input defaultValue={clockTime} onChange={(event) => props.onChange(event, props.index, colKey)} />
}

const renderComment = (comment, props, colKey) => {
    return <input defaultValue={comment} onChange={(event) => props.onChange(event, props.index, colKey)} />

}

// Iterate over the provided columns we were given, and for each trigger specific rendering for the type it is 
const columnMappers = { 
    "Date": renderUneditableCell, 
    "Clock-in": renderClockTimes, 
    "Clock-Out":renderClockTimes, 
    "Hours":renderUneditableCell, 
    "Comment":renderComment 
}

/* Props overview:
    columns: The list of columns we have 
    row: A dictionary of the row we are creating - it must contain keys matching columns 
    onChange: Callback to when a column entry of the cell is modified 
*/
function Row(props) { 
    return (
        props.columns.map(
            (columnKey, colIdx) => 
            <td key={colIdx}>
                {columnMappers[columnKey](props.row[columnKey], props, columnKey)}
            </td>
        )
    ) 

}

export default Row; 