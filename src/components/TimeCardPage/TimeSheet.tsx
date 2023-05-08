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

import { IconButton, Card, Avatar, HStack, Text } from '@chakra-ui/react'
import { SearchIcon, WarningIcon, DownloadIcon } from '@chakra-ui/icons';

import  { Select, components } from 'chakra-react-select'

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
// label, value needed for react-select
// needs identifying characteristic of user that timesheets can be fetched based on
const testingEmployees = [
    {picture: 'https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1145794687.jpg', name:"david", uuid:123131},
    {picture: 'https://media.glamour.com/photos/56964cd993ef4b095210515b/16:9/w_1280,c_limit/fashion-2015-10-cute-baby-turtles-main.jpg', name:"danimal", uuid:123132},
    {picture: 'https://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-2.jpg', name:"ryan", uuid:123133},
    {picture: 'https://compote.slate.com/images/73f0857e-2a1a-4fea-b97a-bd4c241c01f5.jpg', name:"izzy", uuid:123134},
    {picture: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2013/01/24/12/v2-cute-cat-picture.jpg', name:"kaylee", uuid:123135}
]

function ProfileCard({employee}) {

    return (
        <Card direction="row" width="50%">
            <Avatar src={employee.picture} name={employee.name} size='md' showBorder={true} borderColor='black' borderWidth='thick'/>
            <CardBody>
                <Text>{employee.name}</Text>
            </CardBody>
        </Card>
    )
}

function SearchEmployeeTimesheet({employees, setSelected}) {
    
    const handleChange = (selectedOption) => {
        setSelected(selectedOption);
    }

    const customStyles = {
        control: (base) => ({
          ...base,
          flexDirection: 'row-reverse',
        }),
      }

    const DropdownIndicator = (props) => {
        return (
          <components.DropdownIndicator {...props}>
            <SearchIcon />
          </components.DropdownIndicator>
        );
      };

    //TODO: fix styling
    return (
        <div style={{width: '600px'}}>
            <Select isSearchable={true} 
            defaultValue={employees[0]} 
            chakraStyles={customStyles} 
            size="lg" options={employees} 
            onChange={handleChange} 
            components={{ DropdownIndicator }}
            getOptionLabel={option =>`${option.name}`}
            getOptionValue={option => `${option.name}`}/>
        </div>
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
    
    //TODO: default to first employee but idk if employee always exists
    const [selected, setSelected] = useState<any>();
    const [user, setUser] = useState<any>();

    const [userTimesheets, setUserTimesheets] = useState([]); 
    const [currentTimesheets, setCurrentTimesheets] = useState([]);
    const [selectedTimesheet, setTimesheet] = useState<any>();
    const columns = defaultColumns 

    // const getUserTimesheets , useMemo it and replace the useEffect
    // use it and selected.userId or whatever 
    // to change between timesheets

    // add some logic on what to do when employee vs manager
    // if employee - set selected to be employee uuid
    // if manager - set selected to be first employee of manager uuid
    // modify getUserTimesheet endpoint to get be getTimesheet, pass in uuid of user

    // Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        //setTimesheet(testingTimesheetResp)
        apiClient.getUser().then(userInfo => {
            setUser(userInfo);
            console.log(userInfo);
        })
        apiClient.getUserTimesheets().then(timesheets => {
            setUserTimesheets(timesheets); 
            setSelected(timesheets[0]?.UserID); // maybe change
            //By Default just render / select the first timesheet for now 
            setCurrentTimesheetsToDisplay(timesheets, startDate); 
        });
    }, [selected])

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
        <>
            <HStack spacing="120px">
                <ProfileCard employee={testingEmployees[0]}/>
                {(user?.Type === "Supervisor" || user?.Type === "Admin") ?
                    <>
                    <SearchEmployeeTimesheet employees={testingEmployees} setSelected={setSelected}/>
                    <IconButton aria-label='Download' icon={<DownloadIcon />} />
                    <IconButton aria-label='Report' icon={<WarningIcon />} />
                    </>: <></>}
                <DateSelectorCard onDateChange={updateDateRange} date={startDate}/>
                <SubmitCard/>
            </HStack>
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
            
        </>
    )
}