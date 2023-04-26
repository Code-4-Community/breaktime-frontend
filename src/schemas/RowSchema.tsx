import { z } from "zod";
import {CellType, CommentType, Review_Stages} from '../components/TimeCardPage/types'; 

const optionalNumber = z.union([z.undefined(), z.number()]) 

const optionalMember = z.union([z.undefined(), z.object({
    Start: optionalNumber, End: optionalNumber, Author: optionalNumber
})]); 

export const CommentSchema = z.object({
    Author:z.string(), 
    Type: z.enum([CommentType.Comment, CommentType.Report]), 
    Timestamp: z.number(), 
    Content: z.string(), 
})

export type CommentSchema = z.infer<typeof CommentSchema> 

export const RowSchema = z.object({
    Type: z.enum([CellType.Regular, CellType.PTO]), 
    Date: z.number(), 
    Associate: optionalMember, 
    Supervisor: optionalMember, 
    Admin: optionalMember, 
    Comment: z.union([z.undefined(), z.array(CommentSchema)])
})

export type RowSchema = z.infer<typeof RowSchema>
