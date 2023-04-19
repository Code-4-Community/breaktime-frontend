import React, { useState, useEffect } from 'react'
<<<<<<< HEAD
import moment from 'moment';
=======
import { DateRangePicker } from 'react-date-range';
>>>>>>> Redid submit modal

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//TODO - Refactor to chakra 

export default function DateCard(props) {
    const [date, setDate] = useState(undefined);

<<<<<<< HEAD
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
=======
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
>>>>>>> Redid submit modal


