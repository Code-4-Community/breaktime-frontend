import Table from 'react-bootstrap/Table'
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import TimeTableRow from "./TimeTableRow";

//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 

const TIMESHEET_DURATION = 7;



const createTimeSheetEntry = (date, inTime, outTime, hours, comment) => {
  return {
    "Id": uuidv4(),
    "Date": date,
    "Clock-in": inTime,
    "Clock-Out": outTime,
    "Hours": hours,
    "Comment": comment
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
      updatedRows.push(createTimeSheetEntry(currentDate.format("MM/DD/YYYY"), "-", "-", "-", "-"));
      currentDate = currentDate.add(1, 'day');
    }
    if (timeObject.isSame(currentDate)) {
      currentDate = currentDate.add(1, 'day');
    }
    const minutes = Number(item.Duration)
    updatedRows.push(createTimeSheetEntry(
      timeObject.format("MM/DD/YYYY"),
      timeObject.format("hh:MM A"),
      timeObject.add(minutes, "minutes").format("h:mm A"),
      minutes / 60,
      item.Comment.Content
    ));
  })
  while (!currentDate.isSame(moment.unix(startDate).add(7, 'day'))) {
    updatedRows.push(createTimeSheetEntry(currentDate.format("MM/DD/YYYY"), "-", "-", "-", "-"));
    currentDate = currentDate.add(1, 'day');
  }
  return updatedRows;
}

function TimeTable(props) {
  // When a cell gets edited, update the field for that appropriate entry in the rows 
  const onCellChange = (event, rowIndex, colKey) => {
    const updatedRow = rows[rowIndex];
    updatedRow[colKey] = event.target.value;
    setRows(
      [
        ...rows.slice(0, rowIndex),
        updatedRow,
        ...rows.slice(rowIndex + 1)
      ]
    );
  }
  //Adds a row to the specified index 
  const addRow = (row, index) => {
    const newRow = {
      "Id": uuidv4(),
      "Date": "-",
      "Clock-in": "-",
      "Clock-Out": "-",
      "Hours": "-",
      "Comment": "-"
    };
    setRows(
      [
        ...rows.slice(0, index + 1),
        newRow,
        ...rows.slice(index + 1)
      ]
    );
  }

  const delRow = (row, index) => {
    const rowDate = rows[index].Date;

    const updatedRows = rows.filter((_, idx) => { return index !== idx });
    if (index < updatedRows.length && updatedRows[index].Date == "-") {
      updatedRows[index].Date = rowDate;
    }
    setRows(updatedRows);
  }
  const [rows, setRows] = useState([]);

  // Anytime the timesheet object changes this is linked to, re-build rows 
  useEffect(() => {
    const timesheet = props.timesheet;
    if (timesheet !== undefined) {
      setRows(formatRows(timesheet.TableData, timesheet.StartDate));
    }
  }, [props.timesheet])

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
          (row, index) => (
            <tr key={row.Id}>
              <td>
                <button onClick={() => { addRow(row, index) }}>+</button>
                <button onClick={() => { delRow(row, index) }}>-</button>
              </td>
              {
                <TimeTableRow columns={props.columns} row={row} index={index} onChange={onCellChange} />
              }
            </tr>
          )
        )}
      </tbody>
    </Table>
  );

}

export default TimeTable; 