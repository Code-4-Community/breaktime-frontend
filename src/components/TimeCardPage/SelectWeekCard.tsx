import React, {useState, useEffect} from 'react'
import { DateRangePicker } from 'react-date-range';



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


