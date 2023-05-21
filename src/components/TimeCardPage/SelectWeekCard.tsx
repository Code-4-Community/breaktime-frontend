import React, { useState, useEffect, forwardRef, Ref } from 'react'
import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { chakra } from '@chakra-ui/react';

const Calendar = chakra(DatePicker);

export default function DateCard(props) {
    const [date, setDate] = useState(undefined);

    useEffect(() => {
        const providedDate = props.date;
        if (providedDate === undefined) {
            setDate(new Date());
        } else {
            setDate(providedDate.toDate());
        }
    }, [])

    useEffect(() => {
        if (date !== undefined) {
            const startOfWeek = moment(date).startOf('week').unix();
            props.onDateChange(moment.unix(startOfWeek));
        }
    }, [date])

    return (
        <Calendar selected={date} onChange={(date) => setDate(date)} rounded='md' backgroundColor={'gray.100'} p={'4%'} />
    );
}


