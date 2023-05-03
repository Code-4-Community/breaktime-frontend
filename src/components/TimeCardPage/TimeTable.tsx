<<<<<<< HEAD
import Table from 'react-bootstrap/Table' 
import React, {useEffect, useState} from 'react'; 
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

import TimeTableRow from "./TimeTableRow"; 
import {TimeSheetSchema} from '../../schemas/TimesheetSchema'; 
import { Fragment } from 'react';
import { TIMESHEET_DURATION, TIMEZONE } from 'src/constants';
import {CellType} from './types'; 
=======
import Table from 'react-bootstrap/Table'
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import TimeTableRow from "./TimeTableRow";
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f


//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 

<<<<<<< HEAD
=======
const TIMESHEET_DURATION = 7;
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f



const createEmptyRow = (date) => {
    // We assign uuid to provide a unique key identifier to each row for reacts rendering 
    return {
<<<<<<< HEAD
        id: uuidv4(), 
        Type: CellType.Regular, 
        Date: date,  
        Associate: undefined,
        Supervisor: undefined, 
        Admin: undefined,
        Comment: undefined 
=======
        id: uuidv4(),
        "StartDate": date,
        "Duration": undefined,
        "Comment": undefined
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
    }
}

// Converts the provided data into our columns / adds entries for days that are missing default ones 
const formatRows = (providedRows, startDate) => {
    const updatedRows = []

<<<<<<< HEAD
    var currentDate = moment.unix(startDate).tz(TIMEZONE); 

    //This assumes each row is in sorted order by Date / StartTime - if this is not the case things will break 
    providedRows.forEach(item => {
        const timeObject = moment.unix(item.Date).tz(TIMEZONE); 
        //If we are missing a day - add it to the json before we process the next day 
        while (timeObject.isAfter(currentDate, 'day')) {
            updatedRows.push(createEmptyRow(currentDate.unix())); 
            currentDate = currentDate.add(1, 'day');   
        }
        if (timeObject.isSame(currentDate, 'day')) {
            currentDate = currentDate.add(1, 'day'); 
        }  
=======
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
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
        updatedRows.push(
            {
                id: uuidv4(),
                ...item
            }
        );
    })
    //Fill in remaining days if we do not have days that go up to start date + total duration 
<<<<<<< HEAD
    while (!currentDate.isAfter(moment.unix(startDate).tz(TIMEZONE).add(TIMESHEET_DURATION - 1,'day'), 'day')) {
        updatedRows.push(createEmptyRow(currentDate.unix())); 
        currentDate = currentDate.add(1, 'day');  
=======
    while (!currentDate.isAfter(moment.unix(startDate).add(6, 'day'), 'day')) {
        updatedRows.push(createEmptyRow(currentDate.unix()));
        currentDate = currentDate.add(1, 'day');
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
    }
    return updatedRows;
}

<<<<<<< HEAD
interface TableProps {
  timesheet: TimeSheetSchema; 
  columns: String[]; 
  onTimesheetChange: Function; 
} 

function TimeTable(props:TableProps) {
=======
// TODO: setup a context provider so that the timesheet objects get updated appropriately 
// and as a result the aggregation gets updated appropriately
// add auto save functionality where it saves after row changes or smth

function TimeTable(props) {
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f

    //When a row is updated, replace it in our list of rows 
    const onRowChange = (row, rowIndex) => {
        const updatedRows = [
            ...rows.slice(0, rowIndex), 
            row, 
            ...rows.slice(rowIndex+1) 
        ]

        setRows(
<<<<<<< HEAD
            updatedRows
        ); 
        props.onTimesheetChange({
            ...props.timesheet, 
            TableData: updatedRows
        });
    } 
=======
            [
                ...rows.slice(0, rowIndex),
                row,
                ...rows.slice(rowIndex + 1)
            ]
        );
    }
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f

    //Adds a row to the specified index 
    const addRow = (row, index) => {
        const newRow = createEmptyRow(rows[index].Date)
        const updatedRows = [
            ...rows.slice(0, index + 1), 
            newRow, 
            ...rows.slice(index+1)
        ]
        setRows(
<<<<<<< HEAD
            updatedRows
=======
            [
                ...rows.slice(0, index + 1),
                newRow,
                ...rows.slice(index + 1)
            ]
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
        );
        props.onTimesheetChange({
            ...props.timesheet, 
            TableData: updatedRows
        });
    } 

    const delRow = (row, index) => {
<<<<<<< HEAD
        const updatedRows = rows.filter((_, idx)=>{return index !== idx}); 
        setRows(updatedRows); 
        props.onTimesheetChange({
            ...props.timesheet, 
            TableData: updatedRows
        });
=======
        const updatedRows = rows.filter((_, idx) => { return index !== idx });
        setRows(updatedRows);
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
    }
    const [rows, setRows] = useState([]);

    // Anytime the timesheet object changes this is linked to, re-build rows 
    useEffect(() => {
        const timesheet = props.timesheet;
        if (timesheet !== undefined) {
<<<<<<< HEAD
            setRows(formatRows(timesheet.TableData, timesheet.StartDate)); 
        } 
    }, [props.timesheet]) 
    
    var prevDate = undefined; 
    
    return (
    <Table striped bordered hover>
        <thead>
            <tr key="Index">
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
                    prevDate = row.Date; 
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
=======
            setRows(formatRows(timesheet.TableData, timesheet.StartDate));
        }
    }, [props.timesheet])

    useEffect(() => {
        props.onTimesheetChange(rows);
    }, [rows])

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
                                        <button onClick={() => { addRow(row, index) }}>+</button>
                                        <button onClick={() => { delRow(row, index) }}>-</button>
                                    </td>
                                    {
                                        <TimeTableRow row={row} onRowChange={(row) => onRowChange(row, index)} prevDate={dateToSend} />
                                    }
                                </tr>);
                        }
                    )}
                </tbody>
            </Table>

    );
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f

}

export default TimeTable; 