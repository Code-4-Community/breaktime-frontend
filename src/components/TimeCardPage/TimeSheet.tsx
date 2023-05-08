import React, { useState } from 'react';
import TimeTable from './TimeTable'
import { useEffect } from 'react';
import SubmitCard from './SubmitCard';
import DateSelectorCard from './SelectWeekCard'
import moment, {Moment} from 'moment';
import { Tabs, TabList, Tab, CardBody } from '@chakra-ui/react'

import apiClient from '../Auth/apiClient';
import AggregationTable from './AggregationTable';
import {TimeSheetSchema} from '../../schemas/TimesheetSchema'
import {UserSchema} from '../../schemas/UserSchema'

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

const testingEmployees = [
    {UserID: "abc", FirstName: "joe", LastName: "jane", Type: "Employee", Picture: "https://www.google.com/koala.png"},
    {UserID: "bcd", FirstName: "david", LastName: "lev", Type: "Employee", Picture: "https://www.google.com/panda.png"},
    {UserID: "cde", FirstName: "crys", LastName: "tal", Type: "Employee", Picture: "https://www.google.com/capybara.png"},
    {UserID: "def", FirstName: "ken", LastName: "ney", Type: "Employee", Picture: "https://www.google.com/koala.png"},
]

function ProfileCard({employee}) {

    return (
        <Card direction="row" width="50%">
            <Avatar src={employee?.Picture} name={employee?.FirstName + " " + employee?.LastName} size='md' showBorder={true} borderColor='black' borderWidth='thick'/>
            <CardBody>
                <Text>{employee?.FirstName + " " + employee?.LastName}</Text>
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

    // TODO: fix styling
    // at the moment defaultValue is the first user in the employees array
    // which is currently an invariant that matches the useState in Page
    return (
        <div style={{width: '600px'}}>
            <Select isSearchable={true} 
            defaultValue={employees[0]} 
            chakraStyles={customStyles} 
            size="lg" 
            options={employees} 
            onChange={handleChange} 
            components={{ DropdownIndicator }}
            getOptionLabel={option =>`${option.FirstName + " " + option.LastName}`}
            getOptionValue={option => `${option.FirstName + " " + option.LastName}`}/>
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
    const [selected, setSelected] = useState<UserSchema>();
    const [user, setUser] = useState<UserSchema>();

    const [userTimesheets, setUserTimesheets] = useState<TimeSheetSchema[]>([]); 
    const [currentTimesheets, setCurrentTimesheets] = useState<TimeSheetSchema[]>([]);
    const [selectedTimesheet, setTimesheet] = useState<TimeSheetSchema>();
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
        })
        apiClient.getUserTimesheets().then(timesheets => {
            setUserTimesheets(timesheets); 
            //By Default just render / select the first timesheet for now 
            setCurrentTimesheetsToDisplay(timesheets, startDate);
            // fetch the information of the user whos timesheet is being displayed
            // if user is an employee selected and user would be the same
            // if user is a supervisor/admin then selected would contain the information of the user
            // whos timesheet is being looked at and user would contain the supervisor/admins information
            // by default the first user is selected
            apiClient.getUserByUUID(timesheets[0].UserID).then(user =>{
                setSelected(user)
            }) 
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
                <ProfileCard employee={user}/>
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