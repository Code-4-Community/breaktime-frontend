import { z } from "zod";
import {RowSchema} from './RowSchema'; 

export const StatusEntryType = z.union([z.object({
  Date: z.number(), 
  Author: z.string()
}), z.undefined()]); 

export const StatusType = z.object({
  Employee: StatusEntryType, 
  Manager: StatusEntryType,
  Admin: StatusEntryType, 
  Accepted: StatusEntryType 

})

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(), 
  UserID: z.string(), 
  StartDate: z.number(),
  Status: z.string(),
  Company: z.string(), 
  TableData: z.array(RowSchema), 
})

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>
