import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment';
import { Tab, Tabs, TabList } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'

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
        setStartDate(startDate); 
        setEndDate(endDate); 
        currentTimesheetsToDisplay(userTimesheets, start); 
        //TODO - remove once we are finished setting up API calls for  this 
        console.log("New date range has been selceted:\n\t %s \nto \n\t%s", start, end); 
    }
    
    const [userTimesheets, setTimesheets] = useState([]); 
    const [currentTimesheets, setCurrentTimesheets] = useState([]);
    const [selectedTimesheet, setTimesheet] = useState(); 
    const columns = defaultColumns 

    //Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        //setTimesheet(testingTimesheetResp)
        apiClient.getUserTimesheets().then(timesheets => {
            setTimesheets(timesheets); 
            //By Default just render / select the first timesheet for now 
            currentTimesheetsToDisplay(timesheets, startDate); 
        });
    }, [])

    const processTimesheetChange = (timesheet) => {
        //Adding the time entry to the table 
        apiClient.addTimeEntry(timesheet); 
    }

    const currentTimesheetsToDisplay = (timesheets, currentStartDate) => {
        // refactor with moment
        const currentTimesheets = timesheets.filter(sheet => new Date(sheet.StartDate * 1000).toDateString() === currentStartDate.toDateString());
        currentTimesheets.map(sheet => {
                                if (sheet.TableData.length === 0){
                                    sheet.TableData = defaultRows;
                                } 
                               return sheet;
                            })
    
        if (currentTimesheets.length < 1){
            currentTimesheets.push(testingTimesheetResp); // TODO: change
        }

        if (currentTimesheets.length > 1){

            const TotalHours = currentTimesheets.map(sheet => 
                sheet.TableData.map(rows => Number(rows.Duration)));

            // how do i do this with reduce
            let lengthOfLongestSubArray = 0;
            for (let i = 0; i < TotalHours.length; i += 1) {
                lengthOfLongestSubArray = Math.max(TotalHours[i].length, lengthOfLongestSubArray)
            }

            TotalHours.map(row => 
                {
                    if (row.length < lengthOfLongestSubArray) {
                        for (let x = 0; x < lengthOfLongestSubArray - row.length; x += 1) {
                            row.push(0);
                        }
                    }
                    return row;
                })
            
            // TODO: Rewrite
            let transpose = function(arr){
                let m = arr.length;
                let n = arr[0].length;
                let f = [];
                let t = [];
                for (let j=0;j<n; j++){
                  t = [];
                  for (let i=0;i<m; i++){
                    t.push(arr[i][j]);
                  }
                  f.push(t);
                }
                return f;
            } 
            const TotalHourRows = transpose(TotalHours).map(row => row.reduce((acc, val) => acc + val, 0)).map(hours => 
                {   
                    return {"StartDate":"1679918400", "Duration":hours, 
                    "Comment":{
                        "AuthorUUID":"XXXX", 
                        "Type":"Report / Comment, etc", 
                        "Timestamp":"", 
                        "Content":":)" 
                    }}
                }
                );

            // find largest sub array size
            // make every array have same amt of elements, fill in with 0s
            // transpose
            // reduce 
            // done

                const aggregationSheet = {
                    "UserID":"77566d69-3b61-452a-afe8-73dcda96f876", 
                    "TimesheetID":22222, 
                    "Company":"Breaktime",
                    "StartDate":1679918400,
                    "Status":"Accepted",
                    "TableData":TotalHourRows
                }

            currentTimesheets.push(aggregationSheet);

        }


        setCurrentTimesheets(currentTimesheets);
        setTimesheet(currentTimesheets[0]);
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