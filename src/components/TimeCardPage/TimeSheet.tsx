import React, {useState, useMemo} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment-timezone';
import 'moment-timezone';

import {TimeSheetSchema} from '../../schemas/TimesheetSchema'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'

import { TIMESHEET_DURATION, TIMEZONE, EXAMPLE_TIMESHEET } from 'src/constants';

import { TABLE_COLUMNS } from './types';

import apiClient from '../Auth/apiClient';

//TODO - Refactor to backend calls once setup to pull rows, etc. 



//To test uploading a timesheet 
// apiClient.updateUserTimesheet(testingTimesheetResp); 


const user = 'Example User'


export default function Page() {
    const today = moment(); 
    const [startDate, setStartDate] = useState(new Date(today.startOf('week').format())); 
    const [endDate, setEndDate] = useState(new Date(today.endOf('week').format())); 

    const updateDateRange = (start, end) => {
        // Callback for date-range picker - does any pre-processing when grabbing a new date 
        setStartDate(start); 
        setEndDate(end); 
        //TODO - remove once we are finished setting up API calls for  this 
        console.log("New date range has been selceted:\n\t %s \nto \n\t%s", start, end); 
    }
    
    const [userTimesheets,setTimesheets] = useState([]); 
    const [selectedTimesheet, setTimesheet] = useState(undefined); 
      

    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        // apiClient.getUserTimesheets().then(timesheets => {

        //     setTimesheets(timesheets); 
        //     //By Default just render / select the first timesheet for now  
        //     if (timesheets.length > 0) {
        //         setTimesheet(timesheets[0])
        //     }  
        // });  
        setTimesheet(EXAMPLE_TIMESHEET);
    }, [])

    const processTimesheetChange = (timesheet) => {
        //Adding the time entry to the table 
        // apiClient.addTimeEntry(timesheet); 
        //TODO - Upload timesheet to DB 
    }

    const renderWarning = () => {
        const currentDate = moment().tz(TIMEZONE);  

        const dateToCheck = moment(startDate); 
        dateToCheck.add(TIMESHEET_DURATION, 'days'); 
        if (currentDate.isAfter(dateToCheck,'days')) {
            return <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>Your timesheet is late!</AlertTitle>
                    <AlertDescription>Please submit this as soon as possible</AlertDescription>
                </Alert>
        } else {
            const dueDuration = dateToCheck.diff(currentDate,'days'); 
            return <Alert status='info'>
                <AlertIcon />
                <AlertTitle>Your timesheet is due in {dueDuration} days!</AlertTitle>
                <AlertDescription>Remember to press the submit button!</AlertDescription>
            </Alert>
        }
    }

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} startDate = {startDate} endDate={endDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
            </div>
            {useMemo(() => renderWarning(), [startDate])}
            <TimeTable columns={TABLE_COLUMNS} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>
        </div>
    )
}