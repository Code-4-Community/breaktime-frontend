import { z } from "zod";

// The status is either undefined, for not being at that stage yet, or 
// contains the date and author of approving this submission 
export const StatusEntryType = z.union(
  [z.object({
    Date: z.number(),
    AuthorID: z.string()
  }),
  z.undefined()]);

// Status type contains the four stages of the pipeline we have defined
export const StatusType = z.object({
  HoursSubmitted: StatusEntryType,
  HoursReviewed: StatusEntryType,
  Finalized: StatusEntryType
});

export type StatusEntryType = z.infer<typeof StatusEntryType>
export type StatusType = z.infer<typeof StatusType>