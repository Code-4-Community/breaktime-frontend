import { z } from "zod";
import { RowSchema, ScheduledRowSchema, CommentSchema } from "./RowSchema";

// The status is either undefined, for not being at that stage yet, or
// contains the date and author of approving this submission
export const StatusEntryType = z.union([
  z.object({
    Date: z.number(),
    AuthorID: z.string(),
  }),
  z.undefined(),
]);

// Status type contains the four stages of the pipeline we have defined
export const StatusType = z.object({
  HoursSubmitted: StatusEntryType,
  HoursReviewed: StatusEntryType,
  ScheduleSubmitted: StatusEntryType,
  Finalized: StatusEntryType,
});

export const TimeSheetSchema = z.object({
  TimesheetID: z.number(),
  UserID: z.string(),
  StartDate: z.number(),
  Status: StatusType,
  CompanyID: z.string(),
  TableData: z.array(RowSchema),
  ScheduleTableData: ScheduledRowSchema,
  WeekNotes: z.union([z.undefined(), z.array(CommentSchema)]),
});

export type TimeSheetSchema = z.infer<typeof TimeSheetSchema>;
