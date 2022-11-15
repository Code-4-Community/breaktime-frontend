import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-date-picker';

//TODO - Refactor to backend calls once setup to pull rows, etc. 
const defaultColumns = ['Date','Clock-in','Clock-Out','Hours','Comment']

const defaultRows = [
    {"Date":"11/01", "Clock-in":"9:00", "Clock-Out":"3:00", "Hours":"6", "Comment":"Left early"},
    {"Date":"11/02", "Clock-in":"10:00", "Clock-Out":"3:00", "Hours":"5", "Comment":"Arrived Late"},
    {"Date":"11/03", "Clock-in":"7:00", "Clock-Out":"3:00", "Hours":"8", "Comment":"Behavioral incident"},
   

] 

const user = 'Example User'

/*
    TODO - Setup some kind of useEffect to calculate hours -> Unsure of where to put in pipeline 
    - Plus button for menu or just adding a new row? 
*/


export default function Page() {
    const [date, onDateChange] = useState(new Date())

    const columns = defaultColumns

    const [rows,setRows] = useState(defaultRows) 


    const addRow = (row) => {
        console.log("Adding row: " + row);  
        setRows([
            ...rows, 
            row
        ])
    }

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

            <TimeTable columns={columns} rows={rows} addRow={addRow}/>
        </div>
    )
}