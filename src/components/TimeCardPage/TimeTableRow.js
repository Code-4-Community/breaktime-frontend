import Table from 'react-bootstrap/Table' 
import React, {useEffect, useState} from 'react'; 
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


const renderUneditableCell = (entry) => {
    return entry 
}


const renderClockTime = (clockTime, updateClockTime) => {
    if (clockTime !== "") {
        return <TimePicker onChange={(value) => {updateClockTime(value);}} value={clockTime} disableClock={true} />
    }
    return <TimePicker onChange={(value) => {updateClockTime(value);}} value={null}  disableClock={true}  />
}


const renderComment = (comment, setComment) => {
    return <input defaultValue={comment} onChange={(event) => {setComment(event.target.value)}} />

}

/* Props overview:
    row: A dictionary of the row we are creating - it must contain keys matching columns 
    onChange: Callback to when a column entry of the cell is modified 
*/
function Row(props) { 

    const dbRow = props.row; 

    const [startHour, setStart] = useState(""); 
    const [endHour, setEnd] = useState(""); 
    const [dur, setDur] = useState(""); 
    const [comment,setComment] = useState(""); 

    const timeObject = moment.unix(dbRow.StartDate); 
    var date = timeObject.format("MM/DD/YYYY")
    if (props.prevDate !== undefined && timeObject.isSame(moment.unix(props.prevDate), 'day')) {
        date = "-"; 
    }

    //Initally set hours here if they exist and are not empty 
    useEffect(() => {
        if (dbRow.Duration !== undefined) {
            const minutes = Number(dbRow.Duration); 
            setStart(timeObject.format("hh:MM A")); 
            setEnd(timeObject.add(minutes, "minutes").format("h:mm A")); 
        }
        if (dbRow.Comment !== undefined) {
            setComment(dbRow['Comment']['Content']); 
        }
    }, [])
    
    //Calculate hours whenever it is updated here
    useEffect(() => { 
        if (startHour !== "" && endHour !== "" && startHour !== null && endHour !== null) {
            var startTime = moment(startHour, "HH:mm") 
            var endTime = moment(endHour, "HH:mm") 

            if (endTime.isBefore(startTime)) {
                const swap = endTime; 
                setStart(endHour); 
                setEnd(startHour);  
                endTime = startTime; 
                startTime = swap;  

            }

            const diff = moment.duration(endTime.diff(startTime))
            const minutes = diff.asHours(); 
            
            setDur(minutes.toFixed(2)); 
            
            // Calculate and trigger callback that the row has been updated 
            timeObject.hour(startTime.hour()); 
            timeObject.minute(startTime.minute()); 
            dbRow.StartDate = timeObject.unix(); 
            dbRow.Duration = diff.asMinutes(); 
            props.onRowChange(dbRow); 

        } else {
            //TODO - Potentially notify TimeTable that the entry has been updated to be missing these fields now? 
            setDur(""); 
        }
    }, [startHour, endHour])

    //When comment is updated, trigger callback for the row being updated 
    useEffect(() => {
        dbRow.Comment = comment; 
        props.onRowChange(dbRow); 
    }, [comment])


    return [
        <td key="date">
            {renderUneditableCell(date)}
        </td>, 
        <td key="Clock-in">
            {renderClockTime(startHour, setStart)}
        </td>, 
        <td key="Clock-out">
            {renderClockTime(endHour, setEnd)}
        </td>,
        <td key="Hours">
            {renderUneditableCell(dur)}
         </td>, 
        <td key="Comment">
            {renderComment(comment, setComment)}
        </td> 

        ]

}

export default Row; 