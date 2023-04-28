import React, { useState, useEffect } from 'react'
import { DateRangePicker } from 'react-date-range';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//TODO - Refactor to chakra 

export default function DateCard(props) {

  const [selection, setSelection] = useState({
    startDate: props.startDate,
    endDate: props.endDate,
    key: 'selection',
    showDateDisplay: false
  });

  const selectDateRange = (interval) => {
    const selectedRange = interval.selection;
    props.onDateChange(selectedRange.startDate, selectedRange.endDate);

    setSelection(selectedRange);
  }

  return (<div >
    <DateRangePicker
      ranges={[selection]}
      onChange={selectDateRange}
    />
  </div>)
}


