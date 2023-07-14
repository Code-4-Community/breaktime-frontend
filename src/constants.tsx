import moment from "moment-timezone";
import {
  CellType,
  CommentType,
  Review_Stages,
  CellStatus,
} from "./components/TimeCardPage/types";

export const TIMESHEET_DURATION = 7;
export const TIMEZONE = "America/New_York";
export const DATETIME_FORMAT = "MM/DD/YY";

export const enum DEFAULT_COLORS {
    BREAKTIME_BLUE = '#001D66',
    WHITE = '#FFFFFF'
};

export const enum PAGE_ROUTES {
  ROOT = "/",
  TIMECARD = "/timecard",
  LOGOUT = "/logout",
}

// Example data that can be used in testing until we re-format DB
export const EXAMPLE_ROW = {
  Type: CellType.Regular,
  Date: moment().tz(TIMEZONE).unix(),
  Associate: {
    Start: 120,
    End: 300,
    Author: 0,
  },
  Supervisor: undefined,
  Admin: undefined,
  Comment: [
    {
      AuthorID: "Joseph",
      Type: CommentType.Comment,
      Timestamp: moment().tz(TIMEZONE).subtract(1, "days").unix(),
      Content: "Great job with this entry!",
      State: CellStatus.Active,
    },
  ],
};

export const SCHEDULE_ENTRY = {
  Start: 0,
  End: 0,
  AuthorID: "<UUID OF AUTHOR>",
};

export const EXAMPLE_TIMESHEET = {
    UserID: "b43227a4-0b42-4cfc-8a2c-16e2f2e64fbe",
    TimesheetID: "1231231",
    CompanyID: "NEU",
    StartDate: moment().tz(TIMEZONE).startOf('week').day(0).unix(),
    Status: {
        HoursSubmitted: undefined,
        HoursReviewed: undefined,
        ScheduleSubmitted: undefined,
        Finalized: undefined
    }, 
    WeekNotes:[], 
    TableData: [{...EXAMPLE_ROW}], 
    ScheduleTableData: undefined 
}
export const EXAMPLE_TIMESHEET_2 = {
    UserID: "b43227a4-0b42-4cfc-8a2c-16e2f2e64fbe",
    TimesheetID: "1293219",
    CompanyID: "Star Market",
    StartDate: moment().tz(TIMEZONE).startOf('week').day(0).unix(),
    Status: {
        HoursSubmitted: { Date: moment().tz(TIMEZONE).unix(), Author: "<Some UUID of an author>" },
        HoursReviewed: undefined,
        ScheduleSubmitted: undefined,
        Finalized: undefined
    }, 
    WeekNotes:[], 
    TableData: [{...EXAMPLE_ROW}], 
    ScheduleTableData:undefined 
}
