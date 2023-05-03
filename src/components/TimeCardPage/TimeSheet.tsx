import React, { useState } from 'react';
import TimeTable from './TimeTable'
import { useEffect } from 'react';
import SubmitCard from './SubmitCard';
import DateSelectorCard from './SelectWeekCard'
import moment, {Moment} from 'moment';
import { Tabs, TabList, Tab, CardBody } from '@chakra-ui/react'

import apiClient from '../Auth/apiClient';
import { start } from 'repl';
import AggregationTable from './AggregationTable';

import { Input, InputGroup, InputLeftAddon, Card, Avatar, HStack, Text } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';

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

// list of user objects
const testingEmployees = [
    {pic: 'https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1145794687.jpg', name:"david"},
    {pic: 'https://media.glamour.com/photos/56964cd993ef4b095210515b/16:9/w_1280,c_limit/fashion-2015-10-cute-baby-turtles-main.jpg', name:"danimal"},
    {pic: 'https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-2.jpg', name:"ryan"},
    {pic: 'https://compote.slate.com/images/73f0857e-2a1a-4fea-b97a-bd4c241c01f5.jpg', name:"izzy"},
    {pic: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2013/01/24/12/v2-cute-cat-picture.jpg', name:"kaylee"}
]

function ProfileCard({employee}) {
    
    return (
        <Card direction="row">
            <Avatar src={employee.pic} name={employee.name} size='sm'/>
            <CardBody>
                <Text>{employee.name}</Text>
            </CardBody>
        </Card>
    )
}

function SearchEmployeeTimesheet({employees}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEmployees = employees.filter(
        (employee) => {
            return (employee.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
    );
    
    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    return (
        <>
        <InputGroup>
            <InputLeftAddon pointerEvents='none' children={<SearchIcon/>} />
            <Input placeholder='Search Employee Timesheet' onChange={handleChange}/>
        </InputGroup>
        <Card>
            {filteredEmployees.map(
                (employee) => (
                    <option value={employee.name}>{employee.name}</option>
                )
            )}
        </Card>
        </>
    )
}

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
    }

    return (
        <div>
            <div>
                <HStack spacing='60px'>
                    <ProfileCard employee={testingEmployees[0]}/>
                    <SearchEmployeeTimesheet employees={testingEmployees}/>
                    <DateSelectorCard onDateChange={updateDateRange} date={startDate}/>
                    <SubmitCard/>
                </HStack>
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