import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-date-picker';


const columns = ['Date','Clock-in','Clock-Out','Hours','Comment']
//Api calls somewhere to actually populate this? 
/*
    Rows is an array of arrays: 
    Refactor later to pull this and format from db 
*/
const rows = [
    ["11/01", "9:00", "5:00", "8", ""],
    ["11/02", "9:00", "5:00", "8", "Showed up late"],
    ["11/03", "9:00", "5:00", "8", "Left early"],
    ["11/04", "9:00", "5:00", "8", "Missed part of shift "],
    ["11/05", "9:00", "5:00", "8", "Incident with customer "],

] 

const user = 'Example User'




export default function Page() {
    const [date, onDateChange] = useState(new Date())

    return (
        <div>
            <h3>Timecard for {user}:</h3>

            <div style={{"display":'flex'}}>
                <Card>
                    <Card.Body>
                        <DatePicker onChange={onDateChange} value={date}/>
                        <p>Selected Week:</p>
                    </Card.Body>
                </Card>
                <Card style={{'position':'absolute','right':'50%'}}> 
                    <Card.Body>
                        <p>Status: Not Submitted</p> 
                    </Card.Body> 
                </Card>
               
            </div>

            <TimeTable columns={columns} rows={rows}/>
        </div>
    )
}