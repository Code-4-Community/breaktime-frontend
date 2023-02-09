import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import Collapsible from 'react-collapsible';



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


