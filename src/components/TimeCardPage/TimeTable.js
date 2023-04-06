import Table from 'react-bootstrap/Table' 
import React, {useEffect, useState} from 'react'; 
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import TimeTableRow from "./TimeTableRow"; 

//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 

const TIMESHEET_DURATION = 7; 



const createEmptyRow = (date) => {
    // We assign uuid to provide a unique key identifier to each row for reacts rendering 
    return {
        id: uuidv4(), 
        "StartDate":date, 
        "Duration":undefined, 
        "Comment":undefined 
    }
}

// Converts the provided data into our columns / adds entries for days that are missing default ones 
const formatRows = (providedRows, startDate) => {
    const updatedRows = [] 

    var currentDate = moment.unix(startDate); 

    //This assumes each row is in sorted order by Date / StartTime - if this is not the case things will break 
    providedRows.forEach(item => {
        const timeObject = moment.unix(item.StartDate); 
        //If we are missing a day - add it to the json before we process the next day 
        while (timeObject.isAfter(currentDate, 'day')) {
            updatedRows.push(createEmptyRow(currentDate.unix())); 
            currentDate = currentDate.add(1, 'day'); 
        }
        if (timeObject.isSame(currentDate, 'day')) {
            currentDate = currentDate.add(1, 'day'); 
        } 
        updatedRows.push(
            { 
            id:uuidv4(), 
            ...item 
            }
        ); 
    }) 
    //Fill in remaining days if we do not have days that go up to start date + total duration 
    while (!currentDate.isAfter(moment.unix(startDate).add(6,'day'), 'day')) {
        updatedRows.push(createEmptyRow(currentDate.unix())); 
        currentDate = currentDate.add(1, 'day'); 
    }
    return updatedRows; 
}

function TimeTable(props) {

    //When a row is updated, replace it in our list of rows 
    const onRowChange = (row, rowIndex) => {
        setRows(
            [
                ...rows.slice(0, rowIndex), 
                row, 
                ...rows.slice(rowIndex+1) 
            ]
        ); 
    } 

    //Adds a row to the specified index 
    const addRow = (row, index) => {
        const newRow = createEmptyRow(rows[index].StartDate)
        setRows(
            [
                ...rows.slice(0, index + 1), 
                newRow, 
                ...rows.slice(index+1)
            ]
        );
    }

    const delRow = (row, index) => {
        const updatedRows = rows.filter((_, idx)=>{return index !== idx}); 
        setRows(updatedRows); 
    }
    const [rows,setRows] = useState([]); 

    // Anytime the timesheet object changes this is linked to, re-build rows 
    useEffect(() => { 
        const timesheet = props.timesheet; 
        if (timesheet !== undefined) {
            setRows(formatRows(timesheet.TableData, timesheet.StartDate)); 
        } 
    }, [props.timesheet]) 
    
    var prevDate = undefined; 

    return (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th></th>
                {props.columns.map(
                    (column, idx) => (
                        <th key={idx}>{column}</th>
                    ) 
                )}
            </tr>
        </thead>
        <tbody>
            {rows.map(
                (row, index) => {
                    // Let the row know the day of the date before it to know if we should display its start date or not 
                    const dateToSend = prevDate; 
                    prevDate = row.StartDate; 
                    return (
                    <tr key={row.id}>
                        <td>
                            <button onClick={() => {addRow(row, index)}}>+</button>
                            <button onClick={() => {delRow(row, index)}}>-</button>
                        </td>
                        {
                            <TimeTableRow row={row}  onRowChange={(row) => onRowChange(row, index)} prevDate={dateToSend}/>
                        }
                    </tr>); 
                }
            )}
        </tbody>
    </Table>
    );  

}

export default TimeTable; 