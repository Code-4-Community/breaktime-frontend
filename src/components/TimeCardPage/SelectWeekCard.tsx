import React, { useState, useEffect } from 'react'
import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//TODO - Refactor to chakra 

export default function DateCard(props) {
    const [date, setDate] = useState(undefined);

<<<<<<< HEAD
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
=======
    useEffect(() => {
        const providedDate = props.date; 
        if (providedDate === undefined) {
            setDate(new Date()); 
        } else {
            setDate(providedDate.toDate());
        }
    },[])

    useEffect(() => {
        if (date !== undefined) {
            const startOfWeek = moment(date).startOf('week').unix(); 
            props.onDateChange(moment.unix(startOfWeek)); 
        }
    }, [date])

    return (
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      );
    }


>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
