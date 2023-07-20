import React, { useEffect, useState } from "react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Fragment } from "react";

import { Td } from "@chakra-ui/react";

import { TimeEntry } from "./CellTypes/TimeEntry";
import { Duration } from "./CellTypes/HoursCell";
import { DateCell } from "./CellTypes/DateCell";
import { TypeCell } from "./CellTypes/CellType";
import { CommentCell } from "./CellTypes/CommentCell";
import { RowSchema } from "../../schemas/RowSchema";
import ApiClient from "src/components/Auth/apiClient";

import * as updateSchemas from "src/schemas/backend/UpdateTimesheet";
import apiClient from "src/components/Auth/apiClient";

interface RowProps {
  row: RowSchema;
  prevDate: number;
  onRowChange: Function;
  TimesheetID: number;
}

function Row(props: RowProps) {
  const [fields, setFields] = useState<undefined | RowSchema>(undefined);

  const updateField = (key, value) => {
    const newFields = {
      ...fields,
      [key]: value,
    };

    setFields(newFields);
    props.onRowChange(newFields);
    //Send a request to update the db on this item being changed
    ApiClient.updateTimesheet(
      updateSchemas.TimesheetUpdateRequest.parse({
        TimesheetID: props.TimesheetID,
        Operation: updateSchemas.TimesheetOperations.UPDATE,
        Payload: updateSchemas.UpdateRequest.parse({
          Type: updateSchemas.TimesheetListItems.TABLEDATA,
          Id: props.row.UUID,
          Attribute: key,
          Data: value,
        }),
      })
    );
  };

  useEffect(() => {
    if (props.row !== undefined) {
      setFields(RowSchema.parse(props.row));
    }
  }, []);

  if (fields !== undefined) {
    const items = {
      Type: <TypeCell value={fields.Type} setType={updateField} />,
      Date: <DateCell date={fields.Date} prevDate={props.prevDate} />,
      // TODO : The userType is likely able to be adjusted, add this to the props for TimeTableRow
      "Clock-in": (
        <TimeEntry
          row={fields}
          field={"Start"}
          updateFields={updateField}
          userType={"Associate"}
          time={null}
        />
      ),
      "Clock-out": (
        <TimeEntry
          row={fields}
          field={"End"}
          updateFields={updateField}
          userType={"Associate"}
          time={null}
        />
      ),
      Hours: <Duration row={fields} />,
      Comment: (
        <CommentCell comments={fields.Comment} setComment={updateField} />
      ),
    };
    const itemOrdering = [
      "Type",
      "Date",
      "Clock-in",
      "Clock-out",
      "Hours",
      "Comment",
    ];

    return (
      <Fragment>
        {itemOrdering.map((entry) => (
          <Td key={entry}>{items[entry]}</Td>
        ))}
      </Fragment>
    );
  } else {
    return <Fragment></Fragment>;
  }
}

export default Row;
