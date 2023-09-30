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
import { v4 as uuidv4 } from 'uuid';

import TimeTableRow from "./TimeTableRow";
import { TimeSheetSchema } from '../../schemas/TimesheetSchema';
import { CellType } from './types';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

import * as rowSchemas from 'src/schemas/RowSchema'
import ApiClient from '../Auth/apiClient';
import * as updateSchemas from 'src/schemas/backend/UpdateTimesheet'
import { UserSchema } from 'src/schemas/UserSchema';


//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 

//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp

function uploadNewRow(row, timesheetid: number) {
  ApiClient.updateTimesheet(
    updateSchemas.TimesheetUpdateRequest.parse({
      TimesheetID: timesheetid,
      Operation: updateSchemas.TimesheetOperations.INSERT,
      Payload: updateSchemas.InsertRequest.parse({
        Type: updateSchemas.TimesheetListItems.TABLEDATA,
        Item: row
      })
    })
  );
}

const createEmptyRow = (date) => {
  // We assign uuid to provide a unique key identifier to each row for reacts rendering 
  return {
    UUID: uuidv4(),
    Type: CellType.Regular,
    Date: date,
    Associate: undefined,
    Supervisor: undefined,
    Admin: undefined,
    Comment: undefined
  }
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
    //Add this row to the DB 
    uploadNewRow(newRow, props.timesheet.TimesheetID);

  }

  const delRow = (row: rowSchemas.RowSchema, index) => {
    const updatedRows = rows.filter((_, idx) => { return index !== idx });
    setRows(updatedRows);
    props.onTimesheetChange({
      ...props.timesheet,
      TableData: updatedRows
    });
    //Trigger DB call to remove this from the DB 
    ApiClient.updateTimesheet(
      updateSchemas.TimesheetUpdateRequest.parse({
        TimesheetID: props.timesheet.TimesheetID,
        Operation: updateSchemas.TimesheetOperations.DELETE,
        Payload: updateSchemas.DeleteRequest.parse({
          Type: updateSchemas.TimesheetListItems.TABLEDATA,
          Id: row.UUID
        })
      })
    );

  }
  const [rows, setRows] = useState([]);

  // Anytime the timesheet object changes this is linked to, re-build rows 
  useEffect(() => {
    const timesheet = props.timesheet;
    if (timesheet !== undefined) {
      setRows(timesheet.TableData);
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
              <Tr key={row.UUID}>
                <Td>
                  <ButtonGroup>
                    <IconButton aria-label='Add row' onClick={() => { addRow(row, index) }} icon={<AddIcon />} />
                    <IconButton aria-label='Delete row' onClick={() => { delRow(row, index) }} icon={<MinusIcon />} />
                  </ButtonGroup>
                </Td>
                {
                  <TimeTableRow row={row} onRowChange={(row) => onRowChange(row, index)} prevDate={dateToSend} TimesheetID={props.timesheet.TimesheetID} />
                }
              </Tr>);
          }
        )}
      </Tbody>
    </Table>
  );
}
export default TimeTable;
