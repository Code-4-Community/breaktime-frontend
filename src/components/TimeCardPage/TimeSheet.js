import React, {useState} from 'react'; 
import TimeTable from './TimeTable'
import Card from 'react-bootstrap/Card';
import DatePicker from 'react-date-picker';
import { useEffect } from 'react';
import SubmitCard from './SubmitCard'; 
import DateSelectorCard from './SelectWeekCard'
import moment from 'moment';
import TimeEntry from './TimeEntry'

//TODO - Refactor to backend calls once setup to pull rows, etc. 
const defaultColumns = ['Date','Clock-in','Clock-Out','Hours','Comment']

// const defaultRows = [
//     {"Date":"11/01", "Clock-in":"9:00", "Clock-Out":"3:00", "Hours":"6", "Comment":"Left early"},
//     {"Date":"11/02", "Clock-in":"10:00", "Clock-Out":"3:00", "Hours":"5", "Comment":"Arrived Late"},
//     {"Date":"11/03", "Clock-in":"7:00", "Clock-Out":"3:00", "Hours":"8", "Comment":"Behavioral incident"},
// ] 

const exampleApiCall = [
    {'startDate':"Tue Feb 14 2023 9:00:00 GMT-0500", 'endDate':"Tue Feb 14 2023 15:00:00 GMT-0500"},
    {'startDate':"Wed Feb 15 2023 8:01:00 GMT-0500", 'endDate':"Wed Feb 15 2023 13:00:00 GMT-0500"},
    {'startDate':"Thu Feb 16 2023 7:30:00 GMT-0500", 'endDate':"Thu Feb 16 2023 14:20:00 GMT-0500"},
    {'startDate':"Fri Feb 17 2023 5:00:00 GMT-0500", 'endDate':"Fri Feb 17 2023 19:33:00 GMT-0500"},
]

const user = 'Example User'


export default function Page() {
    const today = moment(); 
    const [startDate, setStartDate] = useState(new Date(today.startOf('week').format())); 
    const [endDate, setEndDate] = useState(new Date(today.endOf('week').format())); 


    const updateDateRange = (start, end) => {
        // Callback for date-range picker - does any pre-processing when grabbing a new date 
        setStartDate(startDate); 
        setEndDate(endDate); 
        //TODO - remove once we are finished setting up API calls for  this 
        console.log("New date range has been selceted:\n\t %s \nto \n\t%s", start, end); 
    }

    const columns = defaultColumns ; 
    const [rows,setRows] = useState([]); 

    

    useEffect(() => {
        const fetchedData = []; 
        //API call for this user to grab their timesheet -> Currently stubbed to just default json file 
        for (let idx = 0; idx < exampleApiCall.length; idx++ ) {        
            const row_dictionary = new TimeEntry(exampleApiCall[idx].startDate, exampleApiCall[idx].endDate).exportValues(); 
            fetchedData.push(row_dictionary); 
        }
        console.log(fetchedData); 
        setRows(fetchedData); 
    }, [])

    


    useEffect(() => {
        //TODO define handling logic for when rows has been modified? Update db? 

        //TODO - Refactor this to be a useeffect on a button press 
        console.log("Rows has updated!"); 
    },[rows])


    const addRow = (row) => {
        /*
            TODO - Add in logic for nicely adding the row to where it should show up based on the representation of the table. Could do something like 
            based on how many non-empty values it has, etc. 
        */
        console.log("Adding row: " + row);  
        setRows([
            ...rows, 
            row
        ])
    }

    const updateCell = (rowIndex, colKey, value) => {
        /*
            Updates provided tables data references for a given index, column, and value 
            @param rowIndex: The row index we are modifying 
            @param colKey: The column we are modifying 
            @param value: The new value of this cell row table[rowIndex][colKey] 
        */
       rows[rowIndex][colKey] = value 
       setRows(rows) 
       console.log(rows) 
    }

    return (
        <div>
            <div  style={{"display":'flex'}}>
                <DateSelectorCard onDateChange={updateDateRange} startDate = {startDate} endDate={endDate}/>
                <div className="col-md-5"></div>
                <SubmitCard/>
                
               
            </div>

            <TimeTable columns={columns} rows={rows} addRow={addRow} setRows={setRows} updateCell = {updateCell}/>
        </div>
    )
}