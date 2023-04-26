import { z } from "zod";
import {RowSchema} from './RowSchema'; 

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(), 
  UserID: z.string(), 
  StartDate: z.number(),
  Status: z.string(),
  Company: z.string(), 
  TableData: z.array(RowSchema), 
})

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>
