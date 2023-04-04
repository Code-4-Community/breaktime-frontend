import React, { useState } from 'react';
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard';
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment';

import apiClient from '../Auth/apiClient';

//TODO - Refactor to backend calls once setup to pull rows, etc. 
const defaultColumns = ['Date', 'Clock-in', 'Clock-Out', 'Hours', 'Comment']



const defaultRows = [
    {"StartDate":"1679918400", "Duration":"132", 
    "Comment":{
        "AuthorUUID":"XXXX", 
        "Type":"Report / Comment, etc", 
        "Timestamp":"", 
        "Content":":)" 
    }}, 
    
] 
// Example timesheet we are parsing out 
const testingTimesheetResp = {
    "UserID":"77566d69-3b61-452a-afe8-73dcda96f876", 
    "TimesheetID":22222, 
    "Company":"Breaktime",
    "StartDate":1679918400,
    "Status":"Accepted",
    "TableData":defaultRows
}
//To test uploading a timesheet 
// apiClient.updateUserTimesheet(testingTimesheetResp); 


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
    
    const [userTimesheets,setTimesheets] = useState([]); 
    const [selectedTimesheet, setTimesheet] = useState(); 
    const columns = defaultColumns 

    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        // setTimesheet(testingTimesheetResp)
        apiClient.getUserTimesheets().then(timesheets => {
            setTimesheets(timesheets); 
            //By Default just render / select the first timesheet for now  
            if (timesheets.length > 0) {
                setTimesheet(timesheets[0])
            }  
        });  
    }, [])

    const processTimesheetChange = (timesheet) => {
        //Adding the time entry to the table 
        apiClient.addTimeEntry(timesheet); 
    }



    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} startDate = {startDate} endDate={endDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
            </div>
            <TimeTable columns={columns} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>
        </div>
    )
}