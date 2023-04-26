import moment from 'moment-timezone';
import {CellType, CommentType, Review_Stages} from './components/TimeCardPage/types'; 

export const TIMESHEET_DURATION = 7; 
export const TIMEZONE = "America/New_York"; 
export const DATETIME_FORMAT = "MM/DD/YY"; 



export const enum PAGE_ROUTES {
    ROOT = "/",
    TIMECARD = "/timecard", 
    LOGOUT = "/logout"
  }


// Example data that can be used in testing until we re-format DB 
export const EXAMPLE_ROW = {
    Type: CellType.Regular,  
    Date: moment().tz(TIMEZONE).unix(),  
    Associate: {
        Start: 120,  End:300, Author:0
    },  
    Supervisor: undefined, 
    Admin: undefined , 
    Comment: [{
        Author: "Joseph", 
        Type: CommentType.Comment, 
        Timestamp: moment().tz(TIMEZONE).subtract(1, 'days').unix(), 
        Content: "Great job with this entry!"
    }], 
}

export const SCHEDULE_ENTRY = {
    Start: 0, 
    End: 0, 
}

export const EXAMPLE_TIMESHEET = {
    UserID: "b43227a4-0b42-4cfc-8a2c-16e2f2e64fbe", 
    TimesheetID: "1293219", 
    CompanyID: "NEU", 
    StartDate: moment().tz(TIMEZONE).startOf('week').day(0).unix(), 
    Status: {
        Stage: Review_Stages.UNSUBMITTED,
        Timestamp: undefined 
    }, 
    WeekComments:[], 
    TableData: [EXAMPLE_ROW], 
    ScheduledData: {
        Author:"<UUID of person>", 
        TableData: [SCHEDULE_ENTRY]
    }
}