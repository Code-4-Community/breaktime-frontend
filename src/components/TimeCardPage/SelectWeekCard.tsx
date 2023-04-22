import React, {useState, useEffect} from 'react'
import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//TODO - Refactor to chakra 

export default function DateCard(props) {
    const [date, setDate] = useState(undefined);

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
            // There is a bug in moment that requires us to format it like this twice 
            const startOfWeek = moment(date).startOf('week').unix();
            props.onDateChange(moment.unix(startOfWeek)); 
        }
    }, [date])

    return (
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      );

}


