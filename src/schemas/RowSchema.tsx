import { z } from "zod";
import {CellType, CommentType, Review_Stages, CellStatus} from '../components/TimeCardPage/types'; 

const optionalNumber = z.union([z.undefined(), z.number()]) 
const optionalString = z.union([z.undefined(), z.string()]); 



const optionalMember = z.union([z.undefined(), z.object({
    Start: optionalNumber, End: optionalNumber, AuthorID: optionalString
})]); 

export const CommentSchema = z.object({
    AuthorID:z.string(), 
    Type: z.enum([CommentType.Comment, CommentType.Report]), 
    Timestamp: z.number(), 
    Content: z.string(), 
    State: z.enum([CellStatus.Active, CellStatus.Deleted]), 
}); 

export type CommentSchema = z.infer<typeof CommentSchema> 

export const RowSchema = z.object({
    Type: z.enum([CellType.Regular, CellType.PTO]), 
    Date: z.number(), 
    Associate: optionalMember, 
    Supervisor: optionalMember, 
    Admin: optionalMember, 
    Comment: z.union([z.undefined(), z.array(CommentSchema)])
}); 
export type RowSchema = z.infer<typeof RowSchema>


export const ScheduledRowSchema = z.union([
    z.undefined(),
    optionalMember
]) 

export type ScheduledRowSchema  = z.infer<typeof ScheduledRowSchema>
