import moment from "moment-timezone";
import {
  CellType,
  CommentType,
  Review_Stages,
  CellStatus,
} from "./components/TimeCardPage/types";

export const TIMESHEET_DURATION = 7;

export const TIMEZONE = "America/NewYork";
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

