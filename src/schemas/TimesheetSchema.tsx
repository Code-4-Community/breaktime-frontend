import { z } from "zod";
import {RowSchema} from './RowSchema'; 

// The status is either undefined, for not being at that stage yet, or 
// contains the date and author of approving this submission 
export const StatusEntryType = z.union(
  [
  z.object({
    Date: z.number(), 
    Author: z.string()
  }), 
  z.undefined()]); 

// Status type contains the four stages of the pipeline we have defined 
export const StatusType = z.object({
  Employee: StatusEntryType, 
  Manager: StatusEntryType,
  Admin: StatusEntryType, 
  Accepted: StatusEntryType 
});

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(), 
  UserID: z.string(), 
  StartDate: z.number(),
  Status: StatusType, 
  Company: z.string(), 
  TableData: z.array(RowSchema), 
}); 

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>
