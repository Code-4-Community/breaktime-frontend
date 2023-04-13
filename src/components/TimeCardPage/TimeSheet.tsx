import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment';
import 'moment-timezone';

import {TimeSheetSchema} from '../../schemas/TimesheetSchema'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'

  import { TIMESHEET_DURATION, TIMEZONE } from 'src/constants';



import apiClient from '../Auth/apiClient';

//TODO - Refactor to backend calls once setup to pull rows, etc. 
const defaultColumns = ['Type', 'Date','Clock-in','Clock-Out','Hours','Comment']



const defaultRows = [
    {   
        "Type":'Regular | PTO, etc', 
        "StartDate":"1679918400", "Duration":"132", 
        "Comment":{
            "Author":"<Name of author>", 
            "Type":"Report / Comment, etc", 
            "Timestamp":"", 
            "Content":":)" 
        }}, 
     
] 

const TimeSheetWeek = {
    "UserID":"", 
    "StartDate":"", 

}
// Example timesheet we are parsing out 
const testingTimesheetResp = {
    "UserID":"77566d69-3b61-452a-afe8-73dcda96f876", 
    "TimesheetID":22222, 
    "Company":"Breaktime", 
    "StartDate":1679918400,
    "Status":{
        "Stage":"Accepted",
        "Timestamp":"<Epoch of when it was accepted>"
    },
    "TableData":defaultRows, 
    "ExpectedData":[], 
    "Comments":[]
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
    const [selectedTimesheet, setTimesheet] = useState(undefined); 
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
        // apiClient.addTimeEntry(timesheet); 
        //TODO - Upload timesheet to DB 
    }

    const renderWarning = () => {
        const currentDate = moment().tz(TIMEZONE);  
        if (selectedTimesheet !== undefined) { 
            const startDate = moment.unix(selectedTimesheet.StartDate).tz(TIMEZONE); 
            startDate.add(TIMESHEET_DURATION, 'days'); 
            
            if (currentDate.isAfter(startDate,'days')) {
                return <Alert status='error'>
                        <AlertIcon />
                        <AlertTitle>Your timesheet is late!</AlertTitle>
                        <AlertDescription>Please submit this as soon as possible</AlertDescription>
                    </Alert>
            } else {
                const dueDuration = startDate.diff(currentDate,'days'); 
                return <Alert status='info'>
                    <AlertIcon />
                    <AlertTitle>Your timesheet is due in {dueDuration} days!</AlertTitle>
                    <AlertDescription>Remember to press the submit button!</AlertDescription>
                </Alert>
            }
        }
    }

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} startDate = {startDate} endDate={endDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
            </div>
            {renderWarning()}
            <TimeTable columns={columns} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>
        </div>
    )
}