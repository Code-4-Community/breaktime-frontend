import moment from "moment-timezone";
import React from "react";

import { DATETIME_FORMAT } from "../../../constants";

interface DateProps {
  date: number;
  prevDate: number | undefined;
}

export function DateCell(props) {
  const dateObj = moment.unix(props.date);
  const prevDate = moment.unix(props.prevDate);

  var formatted = dateObj.format(DATETIME_FORMAT);
  if (props.prevDate !== undefined && dateObj.isSame(prevDate, "days")) {
    formatted = "-";
  }

  return <div>{formatted}</div>;
}
