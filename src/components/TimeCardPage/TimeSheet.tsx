import React, {useState, useMemo} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
<<<<<<< HEAD
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
=======
import moment, {Moment} from 'moment';
import { Tabs, TabList, Tab } from '@chakra-ui/react'
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f

import apiClient from '../Auth/apiClient';
import { start } from 'repl';
import AggregationTable from './AggregationTable';


//TODO - Refactor to backend calls once setup to pull rows, etc. 

<<<<<<< HEAD


=======
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
    "TableData":[]
}
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
//To test uploading a timesheet 
// apiClient.updateUserTimesheet(testingTimesheetResp); 

const createEmptyTable = (startDate, company, userId, timesheetID) => {
    // We assign uuid to provide a unique key identifier to each row for reacts rendering 
    return {
        "UserID":userId, 
        "TimesheetID":timesheetID, 
        "Company":company,
        "StartDate":startDate,
        "Status":"Accepted",
        "TableData":[]
    }
}

const user = 'Example User'


export default function Page() {
<<<<<<< HEAD
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
      
=======
    //const today = moment(); 
    const [startDate, setStartDate] = useState(moment().startOf('week').day(0)); 

    const updateDateRange = (date:Moment) => {
        setStartDate(date); 
        //TODO - Refactor this to use the constant in merge with contants branch 
        setCurrentTimesheetsToDisplay (userTimesheets, date); 
    }
    
    const [userTimesheets, setUserTimesheets] = useState([]); 
    const [currentTimesheets, setCurrentTimesheets] = useState([]);
    const [selectedTimesheet, setTimesheet] = useState();
    const columns = defaultColumns 
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f

    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
<<<<<<< HEAD
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
        //TODO - Define logic of what to do here? 
        selectedTimesheet.TableData = timesheet.TableData;  
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
=======
        //setTimesheet(testingTimesheetResp)
        apiClient.getUserTimesheets().then(timesheets => {
            setUserTimesheets(timesheets); 
            //By Default just render / select the first timesheet for now 
            setCurrentTimesheetsToDisplay (timesheets, startDate); 
        });
    }, [])

    const processTimesheetChange = (rows) => {
        //Adding the time entry to the table 
        //apiClient.addTimeEntry(timesheet); 
        rows = rows.map((row) => {
            delete row.id;
            return row;
        })

        // update userTimesheets
        // currentTimesheets
        if (rows.length > 0) {
            const changedSheet = createEmptyTable(rows[0].StartDate, selectedTimesheet?.Company,  selectedTimesheet?.UserID, selectedTimesheet?.TimesheetID);
            changedSheet.TableData = rows;
            const newCurrentTimesheets = currentTimesheets.map((sheet) => {
                if (changedSheet.TimesheetID === sheet.TimesheetID){
                    return changedSheet;
                }
                return sheet;
            })

            // also issue with all minutes being changed to 04 for some reason
            // but why
            if (userTimesheets.length > 0) {
                const newUserTimesheets = userTimesheets.map((sheet) => {
                    if (changedSheet.TimesheetID === sheet.TimesheetID){
                        return changedSheet;
                    }
                    return sheet;
                })

                setCurrentTimesheets(newCurrentTimesheets);
                setUserTimesheets(newUserTimesheets);
            }
        }

    }

    const setCurrentTimesheetsToDisplay  = (timesheets, currentStartDate:Moment) => {
        const newCurrentTimesheets  = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));

        if (newCurrentTimesheets.length < 1){
            newCurrentTimesheets.push(createEmptyTable(currentStartDate.unix(), "new", "77566d69-3b61-452a-afe8-73dcda96f876", 22222)); // TODO: change to make correct timesheets for the week
        }

        if (newCurrentTimesheets.length > 1){ 
            newCurrentTimesheets.push(createEmptyTable(currentStartDate.unix(), "Total", "77566d69-3b61-452a-afe8-73dcda96f876", 22222));

        }

        setCurrentTimesheets(newCurrentTimesheets);
        setTimesheet(newCurrentTimesheets[0]);
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
    }

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} date = {startDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
            </div>
<<<<<<< HEAD
            {useMemo(() => renderWarning(), [startDate])}
            <TimeTable columns={TABLE_COLUMNS} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>
=======
            <Tabs>
            <TabList> 
                {currentTimesheets.map(
                    (sheet) => (
                        <Tab onClick={() => setTimesheet(sheet)}>{sheet.Company}</Tab>
                    ) 
                )}
            </TabList>
            </Tabs>
            {selectedTimesheet?.Company === "Total" ? 
            (<AggregationTable startDate={startDate} timesheets={currentTimesheets}/>)
            : (<TimeTable columns={columns} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>)}
            
>>>>>>> 04cf4b562d62fd4fe088866c26e1508a6184674f
        </div>
    )
}