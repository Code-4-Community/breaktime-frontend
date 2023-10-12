import React, { useState, useMemo } from 'react';
import TimeTable from './TimeTable'
import { useEffect } from 'react';
import SubmitCard from './SubmitCard';
import DateSelectorCard from './SelectWeekCard';
import { UserContext } from './UserContext';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  IconButton,
  Card,
  CardBody,
  Avatar,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  Spacer,
  HStack,
  VStack,
  ButtonGroup
} from '@chakra-ui/react'


import { TIMESHEET_DURATION, TIMEZONE, EXAMPLE_TIMESHEET, EXAMPLE_TIMESHEET_2 } from 'src/constants';

import { Review_Stages, TABLE_COLUMNS , CommentType } from './types';
import moment, { Moment } from 'moment-timezone';

import apiClient from '../Auth/apiClient';
import AggregationTable from './AggregationTable';
import { v4 as uuidv4 } from 'uuid';
import { UserSchema } from '../../schemas/UserSchema'

import { SearchIcon, WarningIcon, DownloadIcon } from '@chakra-ui/icons';
import { Select, components } from 'chakra-react-select'
import { TimeSheetSchema } from 'src/schemas/TimesheetSchema';
import { CommentSchema, RowSchema } from 'src/schemas/RowSchema';
import { getAllActiveCommentsOfType } from './utils';
import { Stack } from 'react-bootstrap';
import { Divider } from '@aws-amplify/ui-react';


const testingEmployees = [
  { UserID: "abc", FirstName: "joe", LastName: "jane", Type: "Employee", Picture: "https://upload.wikimedia.org/wikipedia/commons/4/49/Koala_climbing_tree.jpg" },
  { UserID: "bcd", FirstName: "david", LastName: "lev", Type: "Employee", Picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/1200px-Grosser_Panda.JPG" },
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

interface WeeklyCommentSectionProps {
    weeklyComments: CommentSchema[];
    weeklyReports: CommentSchema[];
}

<<<<<<< Updated upstream
// TODO: idk if we're keeping up just gonna remove bc doesnt look great atm
function WeeklyCommentSection({
    weeklyComments, 
    weeklyReports
}: WeeklyCommentSectionProps) {
    // row of Comments
    // row of Reports

    // repetitive but readable code and should be more extensible
    return (
        <HStack>
            <Text>Weekly Feedback</Text>
            <Divider orientation='vertical' />
            <Stack>
                <HStack>
                    <Stack>
                        {weeklyComments.map(
                            (comment) => (
                                <HStack>
                                    {/* TODO: later replace w api call to get user from userID*/}
                                    {/* also use display card once it gets merged in*/}
                                    <ProfileCard employee={testingEmployees[0]} />
                                    <Text>{comment.Content}</Text>
                                </HStack>
                            ))}
                    </Stack>
                </HStack>
                <Divider/>
                <HStack>
                    <Stack>
                        {weeklyReports.map(
                            (report) => (
                                <HStack>
                                    {/* TODO: later replace w api call to get user from userID*/}
                                    <ProfileCard employee={testingEmployees[1]} />
                                    <Text>{report.Content}</Text>
                                </HStack>
                            ))}
                    </Stack>
                </HStack>
            </Stack>
        </HStack>
    )
}

export default function Page() {
  //const today = moment(); 
  const [selectedDate, setSelectedDate] = useState(moment().startOf('week').day(0));

  // fetch the information of the user whos timesheet is being displayed
  // if user is an employee selected and user would be the same
  // if user is a supervisor/admin then selected would contain the information of the user
  // whos timesheet is being looked at and user would contain the supervisor/admins information
  // by default the first user is selected
  const [selectedUser, setSelectedUser] = useState<UserSchema>();
  const [user, setUser] = useState<UserSchema>();
=======

export default function Page() {
    const [selectedDate, setSelectedDate] = useState(moment().startOf('week').day(0));
    const [selectedAssociate, setSelectedAssociate] = useState<UserSchema>();
    const [user, setUser] = useState<UserSchema>();
>>>>>>> Stashed changes

  // associates is only used by supervisor/admin for the list of all associates they have access to
  const [associates, setAssociates] = useState<UserSchema[]>([]);

<<<<<<< Updated upstream
  // A list of the timesheet objects
  // TODO: add types
  const [userTimesheets, setUserTimesheets] = useState([]);
  const [currentTimesheets, setCurrentTimesheets] = useState([]);
  const [selectedTimesheet, setTimesheet] = useState(undefined);

  const [weeklyComments, setWeeklyComments] = useState<CommentSchema[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<CommentSchema[]>([]);

  // this hook should always run first
  useEffect(() => {
    apiClient.getUser().then(userInfo => {
      setUser(userInfo);
      if (userInfo.Type === "Supervisor" || userInfo.Type === "Admin") {
        apiClient.getAllUsers().then(users => {
          setAssociates(users);
          setSelectedUser(users[0]);
=======
    // A list of the timesheet objects
    const [userTimesheets, setUserTimesheets] = useState<TimeSheetSchema[]>([]);
    const [currentTimesheets, setCurrentTimesheets] = useState<TimeSheetSchema[]>([]);
    const [selectedTimesheet, setTimesheet] = useState<TimeSheetSchema>(undefined);

    // this hook should always run first
    useEffect(() => {
        apiClient.getUser().then(userInfo => {
            setUser(userInfo);
            if (userInfo.Type === "Supervisor" || userInfo.Type === "Admin") {
                apiClient.getAllUsers().then(users => {
                    setAssociates(users);
                    setSelectedAssociate(users[0]);
                })
            }
            setSelectedAssociate(userInfo)
>>>>>>> Stashed changes
        })
      }
      setSelectedUser(userInfo)
    })
    // if employee setSelectedUSer to be userinfo
    // if supervisor/admin get all users
    // set selected user
  }, [])

<<<<<<< Updated upstream
  // Pulls user timesheets, marking first returned as the active one
  useEffect(() => {
    apiClient.getUserTimesheets(selectedUser?.UserID).then(timesheets => {
      setUserTimesheets(timesheets);
      //By Default just render / select the first timesheet for now
      setCurrentTimesheetsToDisplay(timesheets, selectedDate);
    });
  }, [selectedUser])

  const processTimesheetChange = (updated_sheet) => {
    // Updating the rows of the selected timesheets from our list of timesheets
    const modifiedTimesheets = userTimesheets.map((entry) => {
      if (entry.TimesheetID === selectedTimesheet.TimesheetID) {
        return {
          ...entry,
          TableData: updated_sheet.TableData
=======
    // Pulls user timesheets, marking first returned as the active one
    useEffect(() => {
        apiClient.getUserTimesheets(selectedAssociate?.UserID).then(timesheets => {
            setUserTimesheets(timesheets);
            //By Default just render / select the first timesheet for now
            setCurrentTimesheetsToDisplay(timesheets, selectedDate);
        });
    }, [selectedAssociate])

    //update userTimesheets when selectedTimesheet is updated
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
    }

    const updateDateRange = (date: Moment) => {
        setSelectedDate(date);
        //TODO - Return the timesheets within the given period
        setCurrentTimesheetsToDisplay(userTimesheets, date);
    }




    const setCurrentTimesheetsToDisplay = (timesheets, currentStartDate: Moment) => {
        // currently only returning timesheets for a week (duration can't be modified)
        const newCurrentTimesheets = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));

        setCurrentTimesheets(newCurrentTimesheets);
        //TODO - check that there are always timesheets
        if (newCurrentTimesheets.length > 0) {
            setTimesheet(newCurrentTimesheets[0])
>>>>>>> Stashed changes
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
    }

  const updateDateRange = (date: Moment) => {
    setSelectedDate(date);
    //TODO - Refactor this to use the constant in merge with contants branch 
    setCurrentTimesheetsToDisplay(userTimesheets, date);
  }

  const changeTimesheet = (sheet) => {
      setTimesheet(sheet)
      setWeeklyComments(getAllActiveCommentsOfType(CommentType.Comment, sheet.WeekNotes))
      setWeeklyReports(getAllActiveCommentsOfType(CommentType.Report, sheet.WeekNotes))
  }


  const setCurrentTimesheetsToDisplay = (timesheets, currentStartDate: Moment) => {
    const newCurrentTimesheets = timesheets.filter(sheet => moment.unix(sheet.StartDate).isSame(currentStartDate, 'day'));

    setCurrentTimesheets(newCurrentTimesheets);
    if (newCurrentTimesheets.length > 0) {
      changeTimesheet(newCurrentTimesheets[0])
    }
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
<<<<<<< Updated upstream
                        <SearchEmployeeTimesheet employees={associates} setSelected={setSelectedUser} />
                        <IconButton aria-label='Download' icon={<DownloadIcon />} />
                        <IconButton aria-label='Report' icon={<WarningIcon />} />
=======
                        <SearchEmployeeTimesheet employees={associates} setSelected={setSelectedAssociate}/>
                        <IconButton aria-label='Download' icon={<DownloadIcon/>}/>
                        <IconButton aria-label='Report' icon={<WarningIcon/>}/>
>>>>>>> Stashed changes
                    </> : <></>}
                <DateSelectorCard onDateChange={updateDateRange} date={selectedDate} />
                
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
                : (<UserContext.Provider value={user}>
                    <TimeTable columns={TABLE_COLUMNS} timesheet={selectedTimesheet} onTimesheetChange={processTimesheetChange} />
                </UserContext.Provider>)}
        </>
    )
}