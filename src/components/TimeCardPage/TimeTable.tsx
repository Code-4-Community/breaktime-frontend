import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';

import TimeTableRow from "./TimeTableRow";
import { TimeSheetSchema } from '../../schemas/TimesheetSchema';
import { TIMESHEET_DURATION, TIMEZONE } from 'src/constants';
import { CellType } from './types';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';


//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 


const createEmptyRow = (date) => {
  // We assign uuid to provide a unique key identifier to each row for reacts rendering 
  return {
    id: uuidv4(),
    Type: CellType.Regular,
    Date: date,
    Associate: undefined,
    Supervisor: undefined,
    Admin: undefined,
    Comment: undefined
  }
}

// Converts the provided data into our columns / adds entries for days that are missing default ones 
const formatRows = (providedRows, startDate) => {
  const updatedRows = []

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
    updatedRows.push(
      {
        id: uuidv4(),
        ...item
      }
    );
  })
  //Fill in remaining days if we do not have days that go up to start date + total duration 
  while (!currentDate.isAfter(moment.unix(startDate).tz(TIMEZONE).add(TIMESHEET_DURATION - 1, 'day'), 'day')) {
    updatedRows.push(createEmptyRow(currentDate.unix()));
    currentDate = currentDate.add(1, 'day');
  }
  return updatedRows;
}

interface TableProps {
  timesheet: TimeSheetSchema;
  columns: String[];
  onTimesheetChange: Function;
}

function TimeTable(props: TableProps) {

  //When a row is updated, replace it in our list of rows 
  const onRowChange = (row, rowIndex) => {
    const updatedRows = [
      ...rows.slice(0, rowIndex),
      row,
      ...rows.slice(rowIndex + 1)
    ]
    setRows(
      updatedRows
    );
    props.onTimesheetChange({
      ...props.timesheet,
      TableData: updatedRows
    });
  }

  //Adds a row to the specified index 
  const addRow = (row, index) => {
    const newRow = createEmptyRow(rows[index].Date)
    const updatedRows = [
      ...rows.slice(0, index + 1),
      newRow,
      ...rows.slice(index + 1)
    ]
    setRows(
      updatedRows
    );
    props.onTimesheetChange({
      ...props.timesheet,
      TableData: updatedRows
    });
  }

  const delRow = (row, index) => {
    const updatedRows = rows.filter((_, idx) => { return index !== idx });
    setRows(updatedRows);
    props.onTimesheetChange({
      ...props.timesheet,
      TableData: updatedRows
    });
  }
  const [rows, setRows] = useState([]);

  // Anytime the timesheet object changes this is linked to, re-build rows 
  useEffect(() => {
    const timesheet = props.timesheet;
    if (timesheet !== undefined) {
      setRows(formatRows(timesheet.TableData, timesheet.StartDate));
    }
  }, [props.timesheet])

  var prevDate = undefined;

  return (
    <Table>
      <Thead>
        <Tr>
          <Th></Th>
          {props.columns.map(
            (column, idx) => (
              <Th key={idx}>{column}</Th>
            )
          )}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map(
          (row, index) => {
            // Let the row know the day of the date before it to know if we should display its start date or not 
            const dateToSend = prevDate;
            prevDate = row.StartDate;
            return (
              <Tr key={row.id}>
                <Td>
                  <ButtonGroup>
                    <IconButton aria-label='Add row' onClick={() => { addRow(row, index) }} icon={<AddIcon />} />
                    <IconButton aria-label='Delete row' onClick={() => { delRow(row, index) }} icon={<MinusIcon />} />
                  </ButtonGroup>
                </Td>
                {
                  <TimeTableRow row={row} onRowChange={(row) => onRowChange(row, index)} prevDate={dateToSend} />
                }
              </Tr>);
          }
        )}
      </Tbody>
    </Table>

  );

}

export default TimeTable; 