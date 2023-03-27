import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment';

import apiClient from '../Auth/apiClient';

//TODO - Refactor to backend calls once setup to pull rows, etc. 
const defaultColumns = ['Date','Clock-in','Clock-Out','Hours','Comment']



const defaultRows = [
    {"StartDate":"1679918400", "Duration":"132", 
    "Comment":{
        "AuthorUUID":"XXXX", 
        "Type":"Report / Comment, etc", 
        "Timestamp":"", 
        "Content":":)" 
    }}, 
    
] 

const testingTimesheetResp = {
    "UserID":"77566d69-3b61-452a-afe8-73dcda96f876", 
    "TimesheetID":22222, 
    "Company":"Breaktime",
    "StartDate":1679918400,
    "Status":"Accepted",
    "TableData":defaultRows

}


const formatRows = (providedRows) => {
    const updatedRows = [] 
    providedRows.forEach(item => {
        const timeObject = moment.unix(item.StartDate); 
        const minutes = Number(item.Duration)
        timeObject.add()
        updatedRows.push({
            "Date":timeObject.format("MM/DD/YYYY"), 
            "Clock-in": timeObject.format("hh:MM A"), 
            "Clock-Out": timeObject.add(minutes, "minutes").format("h:mm A"), 
            "Hours":minutes / 60, 
            "Comment": item.Comment.Content
        })
    })
    return updatedRows; 
}

const user = 'Example User'


export default function Page() {
    const today = moment(); 
    const [startDate, setStartDate] = useState(new Date(today.startOf('week').format())); 
    const [endDate, setEndDate] = useState(new Date(today.endOf('week').format())); 

    const updateDateRange = (start, end) => {
        // Callback for date-range picker - does any pre-processing when grabbing a new date 
        setStartDate(startDate); 
        setEndDate(endDate); 
        //TODO - remove once we are finished setting up API calls for  this 
        console.log("New date range has been selceted:\n\t %s \nto \n\t%s", start, end); 
    }

    const columns = defaultColumns 
    const [rows,setRows] = useState([]) 

    useEffect(() => {
        //IF YOU WANT TO TEST READING 
        // apiClient.getUserTimesheets().then(response => {
        //     console.log(response); 
        // }); 
        //IF YOU WANT TO TEST WRITING UNCOMMENT THIS
        // apiClient.updateUserTimesheet(testingTimesheetResp); 
        //TODO - Make API call here to download the rows! 
        setRows(formatRows(defaultRows)); 
    }, [])

    useEffect(() => {
        //TODO - Define logic of adding a new row - What do we do? 
        console.log("Rows has updated!"); 
    },[rows])


    const addRow = (row) => {
        /*
            TODO - Add in logic for nicely adding the row to where it should show up based on the representation of the table. Could do something like 
            based on how many non-empty values it has, etc. 
        */
        console.log("Adding row: " + row);  
        setRows([
            ...rows, 
            row
        ])
    }

    const updateCell = (rowIndex, colKey, value) => {
        /*
            Updates provided tables data references for a given index, column, and value 
            @param rowIndex: The row index we are modifying 
            @param colKey: The column we are modifying 
            @param value: The new value of this cell row table[rowIndex][colKey] 
        */
       rows[rowIndex][colKey] = value 
       setRows(rows) 
       console.log(rows) 
    }

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} startDate = {startDate} endDate={endDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
                
               
            </div>

            <TimeTable columns={columns} rows={rows} addRow={addRow} setRows={setRows} updateCell = {updateCell}/>
        </div>
    )
}