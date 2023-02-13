import React, {useState, useEffect} from 'react'
import { DateRangePicker } from 'react-date-range';
import Button from 'react-bootstrap/Button';



export default function DateCard(props) {
    const [selected,setSelect] = useState(false); 


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

    const dateSelector = (<div>
        <DateRangePicker
        ranges={[selection]}
        onChange={selectDateRange} 
        />
    </div>)
    
    const selectedStart = new Date(selection.startDate);
    const selectedEnd = new Date(selection.endDate); 

    const formatted = `${selectedStart.getMonth() + 1}/${selectedStart.getDate()} - ${selectedEnd.getMonth() + 1}/${selectedEnd.getDate()}` 


    return (<div><Button style={{'marginLeft':'200px'}} onClick={() => {setSelect(!selected)}}>{formatted}</Button>{selected ?   dateSelector : <div></div>}</div>)
   
}


