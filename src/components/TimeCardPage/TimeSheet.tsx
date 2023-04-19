import React, { useState, useMemo } from 'react';
import TimeTable from './TimeTable'
import { useEffect } from 'react';
import SubmitCard from './SubmitCard';
import DateSelectorCard from './SelectWeekCard'

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import {
    IconButton,
    Card,
    CardBody,
    Avatar,
    HStack,
    Text
} from '@chakra-ui/react'

import {
    Tabs,
    TabList,
    Tab
} from '@chakra-ui/react'


import { TIMESHEET_DURATION, TIMEZONE, EXAMPLE_TIMESHEET, EXAMPLE_TIMESHEET_2 } from 'src/constants';

import { Review_Stages, TABLE_COLUMNS } from './types';
import moment, { Moment } from 'moment-timezone';

import apiClient from '../Auth/apiClient';
import AggregationTable from './AggregationTable';
import { v4 as uuidv4 } from 'uuid';
import { UserSchema } from '../../schemas/UserSchema'

import { SearchIcon, WarningIcon, DownloadIcon } from '@chakra-ui/icons';
import { Select, components } from 'chakra-react-select'

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
        TableData: [],
        ScheduledData: undefined
    }
}

const user = 'Example User'

const testingEmployees = [
    { UserID: "abc", FirstName: "joe", LastName: "jane", Type: "Employee", Picture: "https://www.google.com/koala.png" },
    { UserID: "bcd", FirstName: "david", LastName: "lev", Type: "Employee", Picture: "https://www.google.com/panda.png" },
    { UserID: "cde", FirstName: "crys", LastName: "tal", Type: "Employee", Picture: "https://www.google.com/capybara.png" },
    { UserID: "def", FirstName: "ken", LastName: "ney", Type: "Employee", Picture: "https://www.google.com/koala.png" },
]

function ProfileCard({ employee }) {

    return (
        <Card direction="row" width="50%">
            <Avatar src={employee?.Picture} name={employee?.FirstName + " " + employee?.LastName} size='md' showBorder={true} borderColor='black' borderWidth='thick' />
            <CardBody>
                <Text>{employee?.FirstName + " " + employee?.LastName}</Text>
            </CardBody>
        </Card>
    )
}

function SearchEmployeeTimesheet({ employees, setSelected }) {

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
        <div style={{ width: '600px' }}>
            <Select isSearchable={true}
                defaultValue={employees[0]}
                chakraStyles={customStyles}
                size="lg"
                options={employees}
                onChange={handleChange}
                components={{ DropdownIndicator }}
                getOptionLabel={option => `${option.FirstName + " " + option.LastName}`}
                getOptionValue={option => `${option.FirstName + " " + option.LastName}`} />
        </div>
    )
}

export default function Page() {
    //const today = moment(); 
    const [selectedDate, setSelectedDate] = useState(moment().startOf('week').day(0));

    const updateDateRange = (date: Moment) => {
        setSelectedDate(date);
        //TODO - Refactor this to use the constant in merge with contants branch 
        setCurrentTimesheetsToDisplay(userTimesheets, date);
    }

    // fetch the information of the user whos timesheet is being displayed
    // if user is an employee selected and user would be the same
    // if user is a supervisor/admin then selected would contain the information of the user
    // whos timesheet is being looked at and user would contain the supervisor/admins information
    // by default the first user is selected
    const [selectedUser, setSelectedUser] = useState<UserSchema>();
    const [user, setUser] = useState<UserSchema>();

    // associates is only used by supervisor/admin for the list of all associates they have access to
    const [associates, setAssociates] = useState<UserSchema[]>([]);

    // A list of the timesheet objects 
    // TODO: add types
    const [userTimesheets, setUserTimesheets] = useState([]);
    const [currentTimesheets, setCurrentTimesheets] = useState([]);
    const [selectedTimesheet, setTimesheet] = useState(undefined);


    // this hook should always run first
    useEffect(() => {
        apiClient.getUser().then(userInfo => {
            setUser(userInfo);
            if (userInfo.Type === "Supervisor" || userInfo.Type === "Admin") {
                apiClient.getAllUsers().then(users => {
                    setAssociates(users);
                    setSelectedUser(users[0]);
                })
            }
            setSelectedUser(userInfo)
        })
        // if employee setSelectedUSer to be userinfo
        // if supervisor/admin get all users
        // set selected user
    }, [])

    // Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        // Uncomment this if you want the default one loaded 
        setUserTimesheets([EXAMPLE_TIMESHEET, EXAMPLE_TIMESHEET_2]);

        //apiClient.getUserTimesheets(selectedUser?.UserID).then(timesheets => {
        //    setUserTimesheets(timesheets); 
        //    //By Default just render / select the first timesheet for now 
        //    setCurrentTimesheetsToDisplay(timesheets, startDate);
        //});
    }, [selectedUser])

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

    const setCurrentTimesheetsToDisplay = (timesheets, currentStartDate: Moment) => {
        const newCurrentTimesheets = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));

        if (newCurrentTimesheets.length < 1) {
            newCurrentTimesheets.push(createEmptyTable(currentStartDate.unix(), "new")); // TODO: change to make correct timesheets for the week
        }

        if (newCurrentTimesheets.length > 1) {
            newCurrentTimesheets.push(createEmptyTable(currentStartDate.unix(), "Total"));
        }

        setCurrentTimesheets(newCurrentTimesheets);
        setTimesheet(newCurrentTimesheets[0]);
    }

    const renderWarning = () => {
        const currentDate = moment().tz(TIMEZONE);

        const dateToCheck = moment(selectedDate);
        dateToCheck.add(TIMESHEET_DURATION, 'days');
        if (currentDate.isAfter(dateToCheck, 'days')) {
            return <Alert status='error'>
                <AlertIcon />
                <AlertTitle>Your timesheet is late!</AlertTitle>
                <AlertDescription>Please submit this as soon as possible</AlertDescription>
            </Alert>
        } else {
            const dueDuration = dateToCheck.diff(currentDate, 'days');
            return <Alert status='info'>
                <AlertIcon />
                <AlertTitle>Your timesheet is due in {dueDuration} days!</AlertTitle>
                <AlertDescription>Remember to press the submit button!</AlertDescription>
            </Alert>
        }
    }


    return (
        <>
            <HStack spacing="120px">
                <ProfileCard employee={user} />
                {(user?.Type === "Supervisor" || user?.Type === "Admin") ?
                    <>
                        <SearchEmployeeTimesheet employees={associates} setSelected={setSelectedUser} />
                        <IconButton aria-label='Download' icon={<DownloadIcon />} />
                        <IconButton aria-label='Report' icon={<WarningIcon />} />
                    </> : <></>}
                <DateSelectorCard onDateChange={updateDateRange} date={selectedDate} />
                {selectedTimesheet && <SubmitCard comment={selectedTimesheet.comment} />}

            </HStack>
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
                (<AggregationTable Date={selectedDate} timesheets={currentTimesheets} />)
                : (<TimeTable columns={TABLE_COLUMNS} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange} />)}

        </>
    )
}