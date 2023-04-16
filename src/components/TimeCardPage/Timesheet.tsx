import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment';
import { Tabs, TabList, Tab } from '@chakra-ui/react'

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
        setStartDate(start); 
        setEndDate(end); 
        setCurrentTimesheetsToDisplay (userTimesheets, start); 
        //TODO - remove once we are finished setting up API calls for  this 
        console.log("New date range has been selceted:\n\t %s \nto \n\t%s", start, end); 
    }
    
    const [userTimesheets, setUserTimesheets] = useState([]); 
    const [currentTimesheets, setCurrentTimesheets] = useState([]);
    const [selectedTimesheet, setTimesheet] = useState(); 
    const columns = defaultColumns 

    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        //setTimesheet(testingTimesheetResp)
        apiClient.getUserTimesheets().then(timesheets => {
            setUserTimesheets(timesheets); 
            //By Default just render / select the first timesheet for now 
            setCurrentTimesheetsToDisplay (timesheets, startDate); 
        });
    }, [])

    const processTimesheetChange = (timesheet) => {
        //Adding the time entry to the table 
        //apiClient.addTimeEntry(timesheet); 
    }

    const setCurrentTimesheetsToDisplay  = (timesheets, currentStartDate) => {
        const newCurrentTimesheets  = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));
        newCurrentTimesheets.map(sheet => {
                                if (sheet.TableData.length === 0){
                                    sheet.TableData = defaultRows;
                                } 
                               return sheet;
                            });

        if (newCurrentTimesheets.length < 1){
            newCurrentTimesheets.push(testingTimesheetResp); // TODO: change to make correct timesheets for the week
        }

        if (newCurrentTimesheets.length > 1){

            const totalHoursForEachDay = {};

            // add the days in that stretch to dictionary 
            // set all to 0
            // iterate through each sheet and increment accordingly

            for (let start = moment(startDate); start.isBefore(endDate); start.add(1, 'days')){
                totalHoursForEachDay[String(start)] = 0;
            }

            newCurrentTimesheets.forEach(sheet => {
                sheet.TableData.forEach(entry => {
                    totalHoursForEachDay[String(moment.unix(entry.StartDate).set({'minutes':0, 'hours':0, 'seconds':0}))] += Number(entry.Duration);
                });
            });

            const aggregatedRows = Object.entries(totalHoursForEachDay).map(entry =>
                ({  "StartDate":String(moment(entry[0]).unix()), 
                    "Duration":String(entry[1]), 
                    "Comment":{
                        "AuthorUUID":"XXXX", 
                        "Type":"Report / Comment, etc", 
                        "Timestamp":"", 
                        "Content":":)" 
                    }
                }));

            const aggregatedCol = {
                "UserID":newCurrentTimesheets[0].UserID, 
                "TimesheetID":22222, 
                "Company":"Total",
                "StartDate":moment(startDate).unix(),
                "Status":"Accepted",
                "TableData":aggregatedRows
            };

            newCurrentTimesheets.push(aggregatedCol);

        }

        setCurrentTimesheets(newCurrentTimesheets );
        setTimesheet(newCurrentTimesheets[0]);
    }

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} startDate = {startDate} endDate={endDate}/>
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
            
            <TimeTable columns={columns} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>
        </div>
    )
}