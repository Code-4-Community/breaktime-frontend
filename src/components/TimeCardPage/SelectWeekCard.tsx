import React, {useState, useEffect} from 'react'
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';


export default function DateCard(props) {

    const [selection, setSelection] = useState({
        startDate: props.startDate.toDate(),
        endDate: props.endDate.toDate(),
        key: 'selection',
        showDateDisplay: false   
      }); 
    
    const selectDateRange = (interval) => {
        const selectedRange = interval.selection; 
        props.onDateChange(moment(selectedRange.startDate), moment(selectedRange.endDate)); 
    
        setSelection(selectedRange); 
    }

    return (<div > 
         <DateRangePicker
                        ranges={[selection]}
                        onChange={selectDateRange} 
        /> 
    </div>)
}


