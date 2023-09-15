import { z } from "zod";
import {CellType, CommentType, Review_Stages, CellStatus, ReportOptions} from '../components/TimeCardPage/types'; 

const optionalNumber = z.union([z.undefined(), z.number()]);
const optionalString = z.union([z.undefined(), z.string()]);



export const TimeRowEntry = z.union([z.undefined(), z.object({
    Start: optionalNumber, End: optionalNumber, AuthorID: optionalString
})]); 
export type TimeRowEntry = z.infer<typeof TimeRowEntry>

export const CommentSchema = z.object({
    UUID: z.string(), 
    AuthorID:z.string(), 
    Type: z.nativeEnum(CommentType), // remove this
    Timestamp: z.number(), 
    Content: z.string(), 
    State: z.nativeEnum(CellStatus),
}); 

export type CommentSchema = z.infer<typeof CommentSchema>

export const ReportSchema = z.object({
    AuthorID:z.string(), 
    Timestamp: z.number(), 
    CorrectTime: z.number(),
    Content: z.nativeEnum(ReportOptions), 
    State: z.nativeEnum(CellStatus), 
}); 

export type ReportSchema = z.infer<typeof ReportSchema>

export const RowSchema = z.object({
    Type: z.nativeEnum(CellType), 
    UUID: z.string(), 
    Type: RowType, 
    Date: z.number(), 
    Associate: TimeRowEntry, 
    Supervisor: TimeRowEntry, 
    Admin: TimeRowEntry, 
    Comment: z.union([z.undefined(), z.array(CommentSchema || ReportSchema)])
}); 
export type RowSchema = z.infer<typeof RowSchema>

export const ScheduledRowSchema = z.object({
    UUID: z.string(), 
    Date: z.number(), 
    Entry: TimeRowEntry
}); 

export type ScheduledRowSchema  = z.infer<typeof ScheduledRowSchema>
