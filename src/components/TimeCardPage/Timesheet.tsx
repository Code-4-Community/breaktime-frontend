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

    const processTimesheetChange = (rows) => {
        //Adding the time entry to the table 
        //apiClient.addTimeEntry(timesheet); 
        rows.map((row) => {
            delete row.id
        })

        // update userTimesheets
        // currentTimesheets
        let changedSheet;
        if (rows.length > 0) {
            changedSheet = createEmptyTable(rows[0].StartDate, selectedTimesheet?.Company,  selectedTimesheet?.UserID, selectedTimesheet?.TimesheetID);
            changedSheet.TableData = rows;
            const newCurrentTimesheets = currentTimesheets.map((sheet) => {
                if (changedSheet.TimesheetID === sheet.TimesheetID){
                    return changedSheet;
                }
                return sheet;
            })

            const newUserTimesheets = userTimesheets.map((sheet) => {
                if (changedSheet.TimesheetID === sheet.TimesheetID){
                    return changedSheet;
                }
                return sheet;
            })
            
            console.log("a", userTimesheets);
            console.log("b", newUserTimesheets);

            setCurrentTimesheets(newCurrentTimesheets);
            //setUserTimesheets(newUserTimesheets);
        }

    }

    const setCurrentTimesheetsToDisplay  = (timesheets, currentStartDate:Moment) => {
        const newCurrentTimesheets  = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));

        if (newCurrentTimesheets.length < 1){
            newCurrentTimesheets.push(createEmptyTable(startDate.unix(), "new", "77566d69-3b61-452a-afe8-73dcda96f876", 22222)); // TODO: change to make correct timesheets for the week
        }

        if (newCurrentTimesheets.length > 1){ 
            newCurrentTimesheets.push(createEmptyTable(startDate.unix(), "Total", "77566d69-3b61-452a-afe8-73dcda96f876", 22222));

        }

        setCurrentTimesheets(newCurrentTimesheets);
        setTimesheet(newCurrentTimesheets[0]);
    }

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
            (<AggregationTable startDate={startDate} timesheets={currentTimesheets}/>)
            : (<TimeTable columns={columns} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange}/>)}
            
        </div>
    )
}