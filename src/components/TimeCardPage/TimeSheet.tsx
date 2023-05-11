import React, {useState, useMemo} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'

import {TimeSheetSchema} from '../../schemas/TimesheetSchema'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'

import { TIMESHEET_DURATION, TIMEZONE, EXAMPLE_TIMESHEET, EXAMPLE_TIMESHEET_2 } from 'src/constants';

import { Review_Stages, TABLE_COLUMNS } from './types';
import moment, {Moment} from 'moment-timezone';
import { Tabs, TabList, Tab } from '@chakra-ui/react'

import apiClient from '../Auth/apiClient';
import { start } from 'repl';
import AggregationTable from './AggregationTable';
import { v4 as uuidv4 } from 'uuid';


//TODO - Refactor to backend calls once setup to pull rows, etc. 


//To test uploading a timesheet 
// apiClient.updateUserTimesheet(testingTimesheetResp); 

const createEmptyTable = (startDate, company) => {
    // We assign uuid to provide a unique key identifier to each row for reacts rendering 
    
    //TODO's: Pull UserID automatically
    return {
        UserID: "77566d69-3b61-452a-afe8-73dcda96f876",
        TimesheetID: uuidv4(), 
        CompanyID: company, 
        StartDate: startDate, 
        Status: {
            Stage: Review_Stages.APPROVED, 
            Timestamp: undefined 
        },
        WeekComments: [], 
        TableData:[], 
        ScheduledData: undefined 
    }
}

const user = 'Example User'


export default function Page() {
    //const today = moment(); 
    const [selectedDate, setSelectedDate] = useState(moment().startOf('week').day(0)); 

    const updateDateRange = (date:Moment) => {
        setSelectedDate(date); 
        //TODO - Refactor this to use the constant in merge with contants branch 
        setCurrentTimesheetsToDisplay (userTimesheets, date); 
    }
    // A list of the timesheet objects 
    const [userTimesheets, setUserTimesheets] = useState([]); 
    const [currentTimesheets, setCurrentTimesheets] = useState([]);
    const [selectedTimesheet, setTimesheet] = useState(undefined);



    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        //setTimesheet(testingTimesheetResp)

        setUserTimesheets([EXAMPLE_TIMESHEET, EXAMPLE_TIMESHEET_2]); 
        

        // apiClient.getUserTimesheets().then(timesheets => {
        //     setUserTimesheets(timesheets); 
        //     //By Default just render / select the first timesheet for now 
        //     setCurrentTimesheetsToDisplay (timesheets, startDate); 
        // });
    }, [])

    const processTimesheetChange = (updated_sheet) => {
        // Updating the rows of the selected timesheets from our list of timesheets 
        const modifiedTimesheets = userTimesheets.map((entry) => {
            if (entry.TimesheetID === selectedTimesheet.TimesheetID) {
                return {
                    ...entry, 
                    TableData: updated_sheet.TableData 
                }
            }
            return entry 
        });
        setUserTimesheets(modifiedTimesheets);  
        
        //Also need to update our list of currently selected - TODO come up with a way to not need these duplicated lists 
        setCurrentTimesheets(currentTimesheets.map(
            (entry) => {
                if (entry.TimesheetID === selectedTimesheet.TimesheetID) {
                    return {
                        ...entry, 
                        TableData: updated_sheet.TableData
                    }
                } 
                return entry 
            }
        ));
        
        // selectedTimesheet.TableData = rows; 
    }

    const setCurrentTimesheetsToDisplay  = (timesheets, currentStartDate:Moment) => {
        const newCurrentTimesheets  = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));

        if (newCurrentTimesheets.length < 1){
            newCurrentTimesheets.push(createEmptyTable(currentStartDate.unix(), "new")); // TODO: change to make correct timesheets for the week
        }

        if (newCurrentTimesheets.length > 1){ 
            newCurrentTimesheets.push(createEmptyTable(currentStartDate.unix(), "Total"));
        }

        setCurrentTimesheets(newCurrentTimesheets);
        setTimesheet(newCurrentTimesheets[0]);
    }

    const renderWarning = () => {
        const currentDate = moment().tz(TIMEZONE);  

        const dateToCheck = moment(selectedDate); 
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
                <DateSelectorCard onDateChange={updateDateRange} date = {selectedDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
            </div>
            {useMemo(() => renderWarning(), [selectedDate])}
            <Tabs>
            <TabList> 
                {currentTimesheets.map(
                    (sheet) => (
                        <Tab onClick={() => setTimesheet(sheet)}>{sheet.CompanyID}</Tab>
                    ) 
                )}
            </TabList>
            </Tabs>
            {selectedTimesheet?.CompanyID === "Total" ? 
            (<AggregationTable Date={selectedDate} timesheets={currentTimesheets}/>)
            : (<TimeTable columns={TABLE_COLUMNS} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>)}
            
        </div>
    )
}