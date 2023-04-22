import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment, {Moment} from 'moment';
import { Tabs, TabList, Tab } from '@chakra-ui/react'

import apiClient from '../Auth/apiClient';
import { start } from 'repl';
import AggregationTable from './AggregationTable';


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
// Example timesheet we are parsing out 
const testingTimesheetResp = {
    "UserID":"77566d69-3b61-452a-afe8-73dcda96f876", 
    "TimesheetID":22222, 
    "Company":"Breaktime",
    "StartDate":1679918400,
    "Status":"Accepted",
    "TableData":[]
}
//To test uploading a timesheet 
// apiClient.updateUserTimesheet(testingTimesheetResp); 

const createEmptyTable = (startDate, company) => {
    // We assign uuid to provide a unique key identifier to each row for reacts rendering 
    return {
        "UserID":"77566d69-3b61-452a-afe8-73dcda96f876", 
        "TimesheetID":22222, 
        "Company":company,
        "StartDate":startDate,
        "Status":"Accepted",
        "TableData":[]
    }
}

const user = 'Example User'

export default function Page() {
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
    const [aggregatedRows, setAggregatedRows] = useState([]); 
    const columns = defaultColumns 

    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        //setTimesheet(testingTimesheetResp)
        apiClient.getUserTimesheets().then(timesheets => {
            setUserTimesheets(timesheets); 
            //By Default just render / select the first timesheet for now 
            // setCurrentTimesheetsToDisplay (timesheets, startDate); 
        });
    }, [])

    const processTimesheetChange = (timesheet) => {
        //Adding the time entry to the table 
        //apiClient.addTimeEntry(timesheet); 
    }

    const setCurrentTimesheetsToDisplay  = (timesheets, currentStartDate:Moment) => {
        const newCurrentTimesheets  = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));


        if (newCurrentTimesheets.length < 1){
            newCurrentTimesheets.push(createEmptyTable(startDate.unix(), "new")); // TODO: change to make correct timesheets for the week
        }

        if (newCurrentTimesheets.length > 1){

            const totalHoursForEachDay = {};

            // add the days in that stretch to dictionary 
            // set all to 0
            // iterate through each sheet and increment accordingly
            
            const finalDate = moment(currentStartDate).add(7, 'days'); 
            const currentDate = moment(currentStartDate); 
            while (currentDate.isBefore(finalDate, 'days')) {
                totalHoursForEachDay[currentDate.format("MM/DD/YY")] = 0; 
                currentDate.add(1, 'day'); 
                console.log("Date: ", currentDate.format("MM/DD/YY")); 
            }
 
            newCurrentTimesheets.forEach(sheet => {
                sheet.TableData.forEach(entry => {
                    totalHoursForEachDay[moment.unix(entry.StartDate).format("MM/DD/YY")] += Number(entry.Duration);
                });
            });

            const aggregatedRows = Object.entries(totalHoursForEachDay).map(entry =>
                ({  "StartDate":moment(entry[0]).unix(), 
                    "Duration":Number(entry[1])
                }));

            setAggregatedRows(aggregatedRows);    

            newCurrentTimesheets.push(createEmptyTable(startDate.unix(), "Total"));

        }
        setCurrentTimesheets(newCurrentTimesheets);
        setTimesheet(newCurrentTimesheets[0]);
    }

    // add conditional logic on when to render aggregation table or timetable

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} date = {startDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
            </div>
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
            (<AggregationTable rows={aggregatedRows}/>)
            : (<TimeTable columns={columns} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>)}
            
        </div>
    )
}