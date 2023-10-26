import { z } from "zod";
import { RowSchema, ScheduledRowSchema, CommentSchema } from "./RowSchema";
import { StatusType } from "./StatusSchema";

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(),
  UserID: z.string(),
  StartDate: z.number(),
  Status: StatusType,
  CompanyID: z.string(),
  TableData: z.array(RowSchema),
  ScheduleTableData: z.union([z.undefined(), z.array(ScheduledRowSchema)]),
  WeekNotes: z.union([z.undefined(), z.array(CommentSchema)]),
});

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>;

export enum TimesheetStatus {
  HOURS_SUBMITTED = "HoursSubmitted",
  HOURS_REVIEWED = "HoursReviewed",
  FINALIZED = "Finalized",
}
